from fastapi import (FastAPI, Depends, HTTPException, UploadFile, File, Header, status, Request)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import crud, models, schemas, auth
from database import engine, get_db
import tempfile, os, zipfile, json, aiofiles, httpx, aiohttp
from deepdiff import DeepDiff
import openai, cohere


app = FastAPI()
# openai.api_key = ""
# generator = pipeline("text-generation", model="EleutherAI/gpt-neo-1.3B")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)


co = cohere.Client("") 

@app.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/templates/{template_id}/versions")
def get_template_versions(template_id: str, db: Session = Depends(get_db)):
    versions = crud.get_template_versions(db, template_id=template_id)
    return versions

@app.get("/templates/{template_id}/diff")
async def get_template_diff(
    template_id: str, 
    version1: int, 
    version2: int, 
    db: Session = Depends(get_db)
):
    version1_data = crud.get_template_version(db, template_id, version1)
    version2_data = crud.get_template_version(db, template_id, version2)
    
    if not version1_data or not version2_data:
        raise HTTPException(status_code=404, detail="Template version not found")
    
    return {
        "oldVersion": version1_data.content,
        "newVersion": version2_data.content
    }

@app.post("/llm/suggestions/")
async def get_suggestions(config_context: dict):
    try:
        prompt = f"Provide configuration suggestions for: {config_context}"

        response = co.generate(
            model="command-xlarge",
            prompt=prompt,
            max_tokens=500,
            temperature=0.7,
        )
        suggestion = response.generations[0].text.strip()
        return {"suggestions": suggestion}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating suggestions: {str(e)}")

@app.post("/templates/", response_model=schemas.Template)
def create_template(template: schemas.TemplateCreate, db: Session = Depends(get_db)):
    return crud.create_template(db=db, template=template)

@app.get("/templates/", response_model=List[schemas.Template])
def read_templates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    templates = crud.get_templates(db, skip=skip, limit=limit)
    return templates

@app.get("/templates/{template_id}", response_model=schemas.Template)
def read_template(template_id: str, db: Session = Depends(get_db)):
    db_template = crud.get_template(db, template_id=template_id)
    if db_template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    return db_template

@app.put("/templates/{template_id}", response_model=schemas.Template)
def update_template(template_id: str, template: schemas.TemplateUpdate, db: Session = Depends(get_db)):
    db_template = crud.update_template(db, template_id, template)
    if db_template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    return db_template

@app.delete("/templates/{template_id}")
def delete_template(template_id: str, db: Session = Depends(get_db)):
    success = crud.delete_template(db, template_id)
    if not success:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted successfully"}

@app.post("/templates/{template_id}/resources/", response_model=schemas.Resource)
def create_resource_for_template(template_id: str, resource: schemas.ResourceCreate, db: Session = Depends(get_db)):
    return crud.create_resource(db=db, resource=resource, template_id=template_id)

@app.put("/resources/{resource_id}", response_model=schemas.Resource)
def update_resource(resource_id: str, resource: schemas.ResourceUpdate, db: Session = Depends(get_db)):
    db_resource = crud.update_resource(db, resource_id, resource)
    if db_resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    return db_resource

@app.delete("/resources/{resource_id}")
def delete_resource(resource_id: str, db: Session = Depends(get_db)):
    success = crud.delete_resource(db, resource_id)
    if not success:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"message": "Resource deleted successfully"}


@app.get("/templates/{template_id}/export")
async def export_template(template_id: str, db: Session = Depends(get_db)):
    db_template = crud.get_template(db, template_id)
    if db_template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    template_data = schemas.Template.from_orm(db_template).dict()
    nixdlt_file_path = crud.pack_template(template_data)
    return FileResponse(nixdlt_file_path, filename=f"{db_template.displayName}.zip", media_type="application/octet-stream")

@app.post("/templates/import")
async def import_template(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(contents)
            temp_file_path = temp_file.name
        
        template_data = crud.unpack_template(temp_file_path)
        os.unlink(temp_file_path)
        
        db_template = crud.import_template_with_resources(db, schemas.TemplateImport(**template_data))
        return db_template
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to import template: {str(e)}")

@app.post("/templates/{template_id}/publish")
async def publish_template_endpoint(
    template_id: str,
    x_nix_wid: Optional[int] = Header(None),
    db: Session = Depends(get_db)
):
    try:
        published_template = await crud.publish_template(db, template_id, x_nix_wid)
        if published_template:
            return {
                "message": "Template published successfully",
                "template": published_template
            }
        raise HTTPException(status_code=400, detail="Failed to publish template")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

