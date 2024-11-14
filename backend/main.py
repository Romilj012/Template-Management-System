from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Annotated, List
import crud, models, schemas
from database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/templates/", response_model=schemas.Template)
def create_template(template: schemas.TemplateCreate, db: Session = Depends(get_db)):
    return crud.create_template(db=db, template=template)

@app.get("/templates/", response_model=list[schemas.Template])
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
def update_template(template_id: str, template: schemas.TemplateCreate, db: Session = Depends(get_db)):
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
def create_resource_for_template(
    template_id: str, resource: schemas.ResourceCreate, db: Session = Depends(get_db)
):
    return crud.create_resource(db=db, resource=resource, template_id=template_id)

@app.put("/resources/{resource_id}", response_model=schemas.Resource)
def update_resource(
    resource_id: str, resource: schemas.ResourceCreate, db: Session = Depends(get_db)
):
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