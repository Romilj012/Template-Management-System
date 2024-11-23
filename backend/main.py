# from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
# from sqlalchemy.orm import Session
# import crud, models, schemas
# from database import engine, get_db
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List
# import tempfile
# import os
# import zipfile
# import json
# from fastapi.responses import FileResponse

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# models.Base.metadata.create_all(bind=engine)


# @app.post("/templates/", response_model=schemas.Template)
# def create_template(template: schemas.TemplateCreate, db: Session = Depends(get_db)):
#     return crud.create_template(db=db, template=template)

# @app.get("/templates/", response_model=List[schemas.Template])
# def read_templates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     templates = crud.get_templates(db, skip=skip, limit=limit)
#     return templates

# @app.get("/templates/{template_id}", response_model=schemas.Template)
# def read_template(template_id: str, db: Session = Depends(get_db)):
#     db_template = crud.get_template(db, template_id=template_id)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return db_template

# @app.put("/templates/{template_id}", response_model=schemas.Template)
# def update_template(template_id: str, template: schemas.TemplateUpdate, db: Session = Depends(get_db)):
#     db_template = crud.update_template(db, template_id, template)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return db_template

# @app.delete("/templates/{template_id}")
# def delete_template(template_id: str, db: Session = Depends(get_db)):
#     success = crud.delete_template(db, template_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return {"message": "Template deleted successfully"}

# @app.post("/templates/{template_id}/resources/", response_model=schemas.Resource)
# def create_resource_for_template(template_id: str, resource: schemas.ResourceCreate, db: Session = Depends(get_db)):
#     return crud.create_resource(db=db, resource=resource, template_id=template_id)

# @app.put("/resources/{resource_id}", response_model=schemas.Resource)
# def update_resource(resource_id: str, resource: schemas.ResourceUpdate, db: Session = Depends(get_db)):
#     db_resource = crud.update_resource(db, resource_id, resource)
#     if db_resource is None:
#         raise HTTPException(status_code=404, detail="Resource not found")
#     return db_resource

# @app.delete("/resources/{resource_id}")
# def delete_resource(resource_id: str, db: Session = Depends(get_db)):
#     success = crud.delete_resource(db, resource_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Resource not found")
#     return {"message": "Resource deleted successfully"}

# @app.post("/templates/{template_id}/publish", response_model=schemas.Template)
# def publish_template(template_id: str, db: Session = Depends(get_db)):
#     db_template = crud.publish_template(db, template_id)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return db_template

# # @app.post("/templates/import")
# # async def import_template(file: UploadFile = File(...), db: Session = Depends(get_db)):
# #     try:
# #         contents = await file.read()
# #         with tempfile.NamedTemporaryFile(delete=False) as temp_file:
# #             temp_file.write(contents)
# #             temp_file_path = temp_file.name

# #         template_data = unpack_template(temp_file_path)
# #         os.unlink(temp_file_path)

# #         print("Template data:", template_data)  # Add this line for debugging

# #         db_template = crud.import_template_with_resources(db, schemas.TemplateImport(**template_data))
# #         return db_template
# #     except Exception as e:
# #         print(f"Error importing template: {str(e)}")
# #         raise HTTPException(status_code=400, detail=f"Failed to import template: {str(e)}")

# @app.get("/templates/{template_id}/export")
# async def export_template(template_id: str, db: Session = Depends(get_db)):
#     db_template = crud.get_template(db, template_id)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
    
#     template_data = schemas.Template.from_orm(db_template).dict()
#     zip_file_path = pack_template(template_data)
    
#     return FileResponse(zip_file_path, filename=f"{db_template.name}.zip", media_type="application/zip")

# # def unpack_template(zip_file_path: str):
# #     with zipfile.ZipFile(zip_file_path, 'r') as zf:
# #         # Find the config.json file
# #         config_file_name = next((name for name in zf.namelist() if name.endswith('config.json')), None)
# #         if not config_file_name:
# #             raise ValueError("Missing config.json in the zip file")
        
# #         with zf.open(config_file_name) as config_file:
# #             template_config = json.load(config_file)

# #         # Map 'displayName' to 'name' if it exists
# #         if 'displayName' in template_config:
# #             template_config['name'] = template_config.pop('displayName')

# #         # Ensure all required fields are present
# #         if 'name' not in template_config:
# #             raise ValueError("Missing 'name' field in template config")

# #         resources = []
# #         for name in zf.namelist():
# #             if name.endswith('/config.json') and not name.endswith('poc/config.json'):
# #                 parts = name.split('/')
# #                 resource_type = parts[-3]  # Assuming structure: types/resource_type/resource_id/config.json
# #                 resource_id = parts[-2]
# #                 with zf.open(name) as resource_file:
# #                     resource_config = json.load(resource_file)
                
# #                 resource = {
# #                     "name": resource_id,
# #                     "type": resource_type.upper(),
# #                     "config": resource_config
# #                 }
# #                 resources.append(resource)

# #         template_config['resources'] = resources
# #         return template_config

# @app.post("/templates/import")
# async def import_template(file: UploadFile = File(...), db: Session = Depends(get_db)):
#     try:
#         contents = await file.read()
#         with tempfile.NamedTemporaryFile(delete=False) as temp_file:
#             temp_file.write(contents)
#             temp_file_path = temp_file.name

#         template_data = unpack_template(temp_file_path)
#         os.unlink(temp_file_path)

#         db_template = crud.import_template_with_resources(db, schemas.TemplateImport(**template_data))
#         return db_template
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Failed to import template: {str(e)}")

# def unpack_template(zip_file_path: str):
#     with zipfile.ZipFile(zip_file_path, 'r') as zf:
#         config_file_name = next((name for name in zf.namelist() if name.endswith('config.json')), None)
#         if not config_file_name:
#             raise ValueError("Missing config.json in the zip file")

#         with zf.open(config_file_name) as config_file:
#             template_config = json.load(config_file)

#         # Map 'displayName' to 'name' if it exists
#         if 'displayName' in template_config:
#             template_config['name'] = template_config.pop('displayName')

#         # Ensure all required fields are present
#         if 'name' not in template_config:
#             raise ValueError("Missing 'name' field in template config")

#         resources = []
#         for name in zf.namelist():
#             if name.endswith('/config.json') and not name.endswith('poc/config.json'):
#                 parts = name.split('/')
#                 resource_type = parts[-3]  # Assuming structure: types/resource_type/resource_id/config.json
#                 resource_id = parts[-2]
#                 with zf.open(name) as resource_file:
#                     resource_config = json.load(resource_file)

#                 # Handle specific mapping for METRIC type
#                 if resource_type.upper() == "METRIC":
#                     resource_config['metricType'] = "timeseries"  # Add default or required fields here if necessary

#                 resource = {
#                     "name": resource_id,
#                     "type": resource_type.upper(),
#                     "config": resource_config
#                 }
#                 resources.append(resource)

#         template_config['resources'] = resources
#         return template_config

# def pack_template(template_data):
#     with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_zip:
#         with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
#             zf.writestr('poc/config.json', json.dumps({
#                 "id": template_data['id'],
#                 "name": template_data['name'],
#                 "description": template_data['description'],
#                 "tags": template_data['tags']
#             }, indent=2))

#             for resource in template_data['resources']:
#                 resource_path = f"poc/types/{resource['type'].lower()}/{resource['name']}/config.json"
#                 zf.writestr(resource_path, json.dumps(resource['config'], indent=2))

#     return temp_zip.name


# 11/20 2:58
# from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
# from sqlalchemy.orm import Session
# import crud, models, schemas
# from database import engine, get_db
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List
# import tempfile
# import os
# import zipfile
# import json
# from fastapi.responses import FileResponse

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# models.Base.metadata.create_all(bind=engine)

# @app.post("/templates/", response_model=schemas.Template)
# def create_template(template: schemas.TemplateCreate, db: Session = Depends(get_db)):
#     return crud.create_template(db=db, template=template)

# @app.get("/templates/", response_model=List[schemas.Template])
# def read_templates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     templates = crud.get_templates(db, skip=skip, limit=limit)
#     return templates

# @app.get("/templates/{template_id}", response_model=schemas.Template)
# def read_template(template_id: str, db: Session = Depends(get_db)):
#     db_template = crud.get_template(db, template_id=template_id)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return db_template

# @app.put("/templates/{template_id}", response_model=schemas.Template)
# def update_template(template_id: str, template: schemas.TemplateUpdate, db: Session = Depends(get_db)):
#     db_template = crud.update_template(db, template_id, template)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return db_template

# @app.delete("/templates/{template_id}")
# def delete_template(template_id: str, db: Session = Depends(get_db)):
#     success = crud.delete_template(db, template_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return {"message": "Template deleted successfully"}

# @app.post("/templates/{template_id}/resources/", response_model=schemas.Resource)
# def create_resource_for_template(template_id: str, resource: schemas.ResourceCreate, db: Session = Depends(get_db)):
#     return crud.create_resource(db=db, resource=resource, template_id=template_id)

# @app.put("/resources/{resource_id}", response_model=schemas.Resource)
# def update_resource(resource_id: str, resource: schemas.ResourceUpdate, db: Session = Depends(get_db)):
#     db_resource = crud.update_resource(db, resource_id, resource)
#     if db_resource is None:
#         raise HTTPException(status_code=404, detail="Resource not found")
#     return db_resource

# @app.delete("/resources/{resource_id}")
# def delete_resource(resource_id: str, db: Session = Depends(get_db)):
#     success = crud.delete_resource(db, resource_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Resource not found")
#     return {"message": "Resource deleted successfully"}

# @app.post("/templates/{template_id}/publish", response_model=schemas.Template)
# def publish_template(template_id: str, db: Session = Depends(get_db)):
#     db_template = crud.publish_template(db, template_id)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return db_template

# @app.get("/templates/{template_id}/export")
# async def export_template(template_id: str, db: Session = Depends(get_db)):
#     db_template = crud.get_template(db, template_id)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
    
#     template_data = schemas.Template.from_orm(db_template).dict()
#     zip_file_path = pack_template(template_data)
    
#     return FileResponse(zip_file_path, filename=f"{db_template.name}.zip", media_type="application/zip")

# @app.post("/templates/import")
# async def import_template(file: UploadFile = File(...), db: Session = Depends(get_db)):
#     try:
#         contents = await file.read()
#         with tempfile.NamedTemporaryFile(delete=False) as temp_file:
#             temp_file.write(contents)
#             temp_file_path = temp_file.name

#         template_data = unpack_template(temp_file_path)
#         os.unlink(temp_file_path)

#         db_template = crud.import_template_with_resources(db, schemas.TemplateImport(**template_data))
#         return db_template
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Failed to import template: {str(e)}")

# @app.get("/templates/{template_id}/export")
# async def export_template(template_id: str, db: Session = Depends(get_db)):
#     db_template = crud.get_template(db, template_id)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
    
#     template_data = schemas.Template.from_orm(db_template).dict()
#     zip_file_path = pack_template(template_data)
    
#     return FileResponse(zip_file_path, filename=f"{db_template.name}.zip", media_type="application/zip")

# def unpack_template(zip_file_path: str):
#     with zipfile.ZipFile(zip_file_path, 'r') as zf:
#         config_file_name = next((name for name in zf.namelist() if name.endswith('/config.json') and name.count('/') == 1), None)
#         if not config_file_name:
#             raise ValueError("Missing config.json in the zip file")

#         with zf.open(config_file_name) as config_file:
#             template_config = json.load(config_file)

#         if 'displayName' in template_config:
#             template_config['name'] = template_config.pop('displayName')

#         if 'name' not in template_config:
#             raise ValueError("Missing 'name' field in template config")

#         resources = []
#         resource_types = ['alerts', 'dashboards', 'datastores', 'inferencestores', 'metrics', 'models']
#         for resource_type in resource_types:
#             for name in zf.namelist():
#                 if name.startswith(f"{template_config['name']}/types/{resource_type}/") and name.endswith('/config.json'):
#                     parts = name.split('/')
#                     resource_id = parts[-2]
#                     with zf.open(name) as resource_file:
#                         resource_config = json.load(resource_file)
                    
#                     resource = {
#                         "name": resource_id,
#                         "type": resource_type[:-1].upper(),
#                         "config": resource_config
#                     }
#                     resources.append(resource)

#         template_config['resources'] = resources
#         return template_config

# def pack_template(template_data):
#     with tempfile.NamedTemporaryFile(delete=False, suffix='.zip') as temp_zip:
#         with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as zf:
#             template_name = template_data['name']
#             zf.writestr(f"{template_name}/config.json", json.dumps({
#                 "id": template_data['id'],
#                 "name": template_data['name'],
#                 "description": template_data['description'],
#                 "tags": template_data['tags']
#             }, indent=2))

#             for resource in template_data['resources']:
#                 resource_path = f"{template_name}/types/{resource['type'].lower()}s/{resource['name']}/config.json"
#                 zf.writestr(resource_path, json.dumps(resource['config'], indent=2))

#                 if resource['type'] == 'MODEL' and 'source' in resource['config']:
#                     src_folder = f"{template_name}/types/models/{resource['name']}/src/"
#                     source = resource['config']['source']
                    
#                     if 'requirements' in source:
#                         zf.writestr(f"{src_folder}requirements.txt", source['requirements'])
                    
#                     if 'init' in source:
#                         zf.writestr(f"{src_folder}__init__.py", source['init'])
                    
#                     if 'config' in source:
#                         zf.writestr(f"{src_folder}config.py", source['config'])
                    
#                     if 'model' in source:
#                         zf.writestr(f"{src_folder}model.py", source['model'])

#     return temp_zip.name

# from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Header
# from sqlalchemy.orm import Session
# import crud, models, schemas
# from database import engine, get_db
# from fastapi.middleware.cors import CORSMiddleware
# from typing import List, Optional
# import tempfile
# import os
# import zipfile
# import json
# from fastapi.responses import FileResponse

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# models.Base.metadata.create_all(bind=engine)


# @app.post("/templates/", response_model=schemas.Template)
# def create_template(template: schemas.TemplateCreate, db: Session = Depends(get_db)):
#     return crud.create_template(db=db, template=template)

# @app.get("/templates/", response_model=List[schemas.Template])
# def read_templates(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     templates = crud.get_templates(db, skip=skip, limit=limit)
#     return templates

# @app.get("/templates/{template_id}", response_model=schemas.Template)
# def read_template(template_id: str, db: Session = Depends(get_db)):
#     db_template = crud.get_template(db, template_id=template_id)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return db_template

# @app.put("/templates/{template_id}", response_model=schemas.Template)
# def update_template(template_id: str, template: schemas.TemplateUpdate, db: Session = Depends(get_db)):
#     db_template = crud.update_template(db, template_id, template)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return db_template

# @app.delete("/templates/{template_id}")
# def delete_template(template_id: str, db: Session = Depends(get_db)):
#     success = crud.delete_template(db, template_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Template not found")
#     return {"message": "Template deleted successfully"}

# @app.post("/templates/{template_id}/resources/", response_model=schemas.Resource)
# def create_resource_for_template(template_id: str, resource: schemas.ResourceCreate, db: Session = Depends(get_db)):
#     return crud.create_resource(db=db, resource=resource, template_id=template_id)

# @app.put("/resources/{resource_id}", response_model=schemas.Resource)
# def update_resource(resource_id: str, resource: schemas.ResourceUpdate, db: Session = Depends(get_db)):
#     db_resource = crud.update_resource(db, resource_id, resource)
#     if db_resource is None:
#         raise HTTPException(status_code=404, detail="Resource not found")
#     return db_resource

# @app.delete("/resources/{resource_id}")
# def delete_resource(resource_id: str, db: Session = Depends(get_db)):
#     success = crud.delete_resource(db, resource_id)
#     if not success:
#         raise HTTPException(status_code=404, detail="Resource not found")
#     return {"message": "Resource deleted successfully"}

# @app.post("/usecases", response_model=schemas.UsecaseSchema)
# async def create_usecase(file: UploadFile = File(...), x_nix_wid: Optional[int] = Header(None)):
#     try:
#         contents = await file.read()
#         template_data = json.loads(contents)
#         template_id = template_data.get('id')
#         key_name = template_data.get('key_name')
#         db = next(get_db())
#         published_template, config_json = crud.publish_template(db, template_id, key_name)

#         if published_template and config_json:
#             usecase_schema = schemas.UsecaseSchema(
#                 id=published_template.id,
#                 displayName=published_template.name,
#                 description=published_template.description,
#                 tags=published_template.tags
#             )
#             return usecase_schema
#         else:
#             raise HTTPException(status_code=404, detail="Template not found")
#     except Exception as e:
#         print(f"Error publishing template: {str(e)}") 
#         raise HTTPException(status_code=400, detail=f"Failed to publish template: {str(e)}")

# # @app.post("/templates/{template_id}/publish")
# # async def publish_template(template_id: str, publish_data: dict, db: Session = Depends(get_db)):
# #     try:
# #         key_name = publish_data.get("key_name")
# #         if not key_name:
# #             raise HTTPException(status_code=422, detail="key_name is required")
        
# #         published_template, config_json = crud.publish_template(db, template_id, key_name)
# #         if published_template:
# #             return {"message": "Template published successfully", "template": published_template}
# #         else:
# #             raise HTTPException(status_code=404, detail="Template not found")
# #     except Exception as e:
# #         print(f"Error publishing template: {str(e)}")  # Add this line for debugging
# #         raise HTTPException(status_code=400, detail=str(e))

# @app.get("/templates/{template_id}/export")
# async def export_template(template_id: str, db: Session = Depends(get_db)):
#     db_template = crud.get_template(db, template_id)
#     if db_template is None:
#         raise HTTPException(status_code=404, detail="Template not found")
#     template_data = schemas.Template.from_orm(db_template).dict()
#     nixdlt_file_path = pack_template(template_data)
#     return FileResponse(nixdlt_file_path, filename=f"{db_template.name}.nixdlt", media_type="application/octet-stream")

# @app.post("/templates/import")
# async def import_template(file: UploadFile = File(...), db: Session = Depends(get_db)):
#     try:
#         contents = await file.read()
#         with tempfile.NamedTemporaryFile(delete=False) as temp_file:
#             temp_file.write(contents)
#             temp_file_path = temp_file.name

#         template_data = unpack_template(temp_file_path)
#         os.unlink(temp_file_path)

#         db_template = crud.import_template_with_resources(db, schemas.TemplateImport(**template_data))
#         return db_template
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Failed to import template: {str(e)}")

# # @app.get("/templates/{template_id}/export")
# # async def export_template(template_id: str, db: Session = Depends(get_db)):
# #     db_template = crud.get_template(db, template_id)
# #     if db_template is None:
# #         raise HTTPException(status_code=404, detail="Template not found")
    
# #     template_data = schemas.Template.from_orm(db_template).dict()
# #     zip_file_path = pack_template(template_data)
    
# #     return FileResponse(zip_file_path, filename=f"{db_template.name}.zip", media_type="application/zip")

# def unpack_template(zip_file_path: str):
#     with zipfile.ZipFile(zip_file_path, 'r') as zf:
#         config_file_name = next((name for name in zf.namelist() if name.endswith('/config.json') and name.count('/') == 1), None)
#         if not config_file_name:
#             raise ValueError("Missing config.json in the zip file")

#         with zf.open(config_file_name) as config_file:
#             template_config = json.load(config_file)

#         if 'displayName' in template_config:
#             template_config['name'] = template_config.pop('displayName')

#         if 'name' not in template_config:
#             raise ValueError("Missing 'name' field in template config")

#         resources = []
#         resource_types = ['alerts', 'dashboards', 'datastores', 'inferencestores', 'metrics', 'models']
#         for resource_type in resource_types:
#             for name in zf.namelist():
#                 if name.startswith(f"{template_config['name']}/types/{resource_type}/") and name.endswith('/config.json'):
#                     parts = name.split('/')
#                     resource_id = parts[-2]
#                     with zf.open(name) as resource_file:
#                         resource_config = json.load(resource_file)
                    
#                     resource = {
#                         "name": resource_id,
#                         "type": resource_type[:-1].upper(),
#                         "config": resource_config
#                     }
#                     resources.append(resource)

#         template_config['resources'] = resources
#         return template_config

# def pack_template(template_data):
#     with tempfile.NamedTemporaryFile(delete=False, suffix='.nixdlt') as temp_file:
#         with zipfile.ZipFile(temp_file, 'w', zipfile.ZIP_DEFLATED) as zf:
#             template_name = template_data['name']
#             zf.writestr(f"{template_name}/config.json", json.dumps({
#                 "id": template_data['id'],
#                 "name": template_data['name'],
#                 "description": template_data['description'],
#                 "tags": template_data['tags']
#             }, indent=2))
#             for resource in template_data['resources']:
#                 resource_path = f"{template_name}/types/{resource['type'].lower()}s/{resource['name']}/config.json"
#                 zf.writestr(resource_path, json.dumps(resource['config'], indent=2))
#                 if resource['type'] == 'MODEL' and 'source' in resource['config']:
#                     src_folder = f"{template_name}/types/models/{resource['name']}/src/"
#                     source = resource['config']['source']
#                     if 'requirements' in source:
#                         zf.writestr(f"{src_folder}requirements.txt", source['requirements'])
#                     if 'init' in source:
#                         zf.writestr(f"{src_folder}__init__.py", source['init'])
#                     if 'config' in source:
#                         zf.writestr(f"{src_folder}config.py", source['config'])
#                     if 'model' in source:
#                         zf.writestr(f"{src_folder}model.py", source['model'])
#     return temp_file.name

# 11/22 5:11
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Header
from sqlalchemy.orm import Session
import crud, models, schemas
from database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware
from deepdiff import DeepDiff
from typing import List, Optional
import tempfile
import os
import zipfile
import json
from fastapi.responses import FileResponse
import openai
import cohere, deepdiff

# from transformers import pipeline

app = FastAPI()
openai.api_key = "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"
# generator = pipeline("text-generation", model="EleutherAI/gpt-neo-1.3B")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)
# @app.post("/llm/suggestions/")
# async def get_suggestions(config_context: dict):
#     try:
#         # Debug the context being sent to the OpenAI API
#         print("Received context:", config_context)
        
#         response = openai.ChatCompletion.create(
#             model="text-embedding-3-small",  # Specify the model
#             messages=[
#                 {"role": "system", "content": "You are an assistant for generating JSON configurations."},
#                 {"role": "user", "content": f"Provide configuration suggestions for: {config_context}"}
#             ],
#             max_tokens=150,
#             temperature=0.7,
#         )
#         suggestion = response['choices'][0]['message']['content'].strip()
#         return {"suggestions": suggestion}
#     except Exception as e:
#         print("Unexpected Error:", e)
#         raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# @app.post("/llm/suggestions/")
# async def get_suggestions(config_context: dict):
#     try:
#         # Generate suggestions
#         prompt = f"Provide configuration suggestions for: {config_context}"
#         response = generator(prompt, max_length=200, num_return_sequences=1)
#         suggestion = response[0]["generated_text"]
#         return {"suggestions": suggestion.strip()}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error generating suggestions: {str(e)}")


co = cohere.Client("ShjMX6mBnZdlnu0iyt1Dfq6dFqboH8XMWqU6jTQZ")  # Replace with your Cohere API key


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
            max_tokens=150,
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

@app.post("/usecases", response_model=schemas.UsecaseSchema)
async def create_usecase(file: UploadFile = File(...), x_nix_wid: Optional[int] = Header(None)):
    try:
        contents = await file.read()
        template_data = json.loads(contents)
        template_id = template_data.get('id')
        key_name = template_data.get('key_name')
        db = next(get_db())
        published_template, config_json = crud.publish_template(db, template_id, key_name)

        if published_template and config_json:
            usecase_schema = schemas.UsecaseSchema(
                id=published_template.id,
                displayName=published_template.displayName,
                description=published_template.description,
                tags=published_template.tags
            )
            return usecase_schema
        else:
            raise HTTPException(status_code=404, detail="Template not found")
    except Exception as e:
        print(f"Error publishing template: {str(e)}") 
        raise HTTPException(status_code=400, detail=f"Failed to publish template: {str(e)}")

# @app.post("/templates/{template_id}/publish")
# async def publish_template(template_id: str, publish_data: dict, db: Session = Depends(get_db)):
#     try:
#         key_name = publish_data.get("key_name")
#         if not key_name:
#             raise HTTPException(status_code=422, detail="key_name is required")
        
#         published_template, config_json = crud.publish_template(db, template_id, key_name)
#         if published_template:
#             return {"message": "Template published successfully", "template": published_template}
#         else:
#             raise HTTPException(status_code=404, detail="Template not found")
#     except Exception as e:
#         print(f"Error publishing template: {str(e)}")  # Add this line for debugging
#         raise HTTPException(status_code=400, detail=str(e))

@app.get("/templates/{template_id}/export")
async def export_template(template_id: str, db: Session = Depends(get_db)):
    db_template = crud.get_template(db, template_id)
    if db_template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    template_data = schemas.Template.from_orm(db_template).dict()
    nixdlt_file_path = pack_template(template_data)
    return FileResponse(nixdlt_file_path, filename=f"{db_template.displayName}.nixdlt", media_type="application/octet-stream")

@app.post("/templates/import")
async def import_template(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(contents)
            temp_file_path = temp_file.name

        template_data = unpack_template(temp_file_path)
        os.unlink(temp_file_path)

        db_template = crud.import_template_with_resources(db, schemas.TemplateImport(**template_data))
        return db_template
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to import template: {str(e)}")


def unpack_template(zip_file_path: str):
    with zipfile.ZipFile(zip_file_path, 'r') as zf:
        config_file_name = next((name for name in zf.namelist() if name.endswith('/config.json') and name.count('/') == 1), None)
        if not config_file_name:
            raise ValueError("Missing config.json in the zip file")

        with zf.open(config_file_name) as config_file:
            template_config = json.load(config_file)

        if 'displayName' not in template_config:
            raise ValueError("Missing 'displayName' field in template config")

        resources = []
        resource_types = ['alerts', 'dashboards', 'datastores', 'inferencestores', 'metrics', 'models']
        for resource_type in resource_types:
            for name in zf.namelist():
                if name.startswith(f"{template_config['displayName']}/types/{resource_type}/") and name.endswith('/config.json'):
                    parts = name.split('/')
                    resource_id = parts[-2]
                    with zf.open(name) as resource_file:
                        resource_config = json.load(resource_file)
                    
                    resource = {
                        "name": resource_id,
                        "type": resource_type[:-1].upper(),
                        "config": resource_config
                    }

                    if resource_type == 'models':
                        source = {}
                        model_folder = f"{template_config['displayName']}/types/models/{resource_id}/"
                        
                        requirements_file = f"{model_folder}requirements.txt"
                        if requirements_file in zf.namelist():
                            with zf.open(requirements_file) as req_file:
                                source['requirements'] = req_file.read().decode('utf-8')

                        src_folder = f"{model_folder}src/"
                        for file_name in ['__init__', 'config', 'model']:
                            file_path = f"{src_folder}{file_name}.py"
                            if file_path in zf.namelist():
                                with zf.open(file_path) as src_file:
                                    source[file_name] = src_file.read().decode('utf-8')

                        if source:
                            resource['config']['source'] = source

                    resources.append(resource)

        template_config['resources'] = resources
        return template_config

def pack_template(template_data):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.nixdlt') as temp_file:
        with zipfile.ZipFile(temp_file, 'w', zipfile.ZIP_DEFLATED) as zf:
            template_name = template_data['displayName']
            zf.writestr(f"{template_name}/config.json", json.dumps({
                "id": template_data['id'],
                "displayName": template_data['displayName'],
                "description": template_data['description'],
                "tags": template_data['tags']
            }, indent=2))

            for resource in template_data['resources']:
                resource_path = f"{template_name}/types/{resource['type'].lower()}s/{resource['name']}/config.json"
                resource_config = resource['config'].copy()
                
                if resource['type'] == 'MODEL' and 'source' in resource_config:
                    source = resource_config.pop('source')
                    model_folder = f"{template_name}/types/models/{resource['name']}/"
                    
                    if 'requirements' in source:
                        zf.writestr(f"{model_folder}requirements.txt", source['requirements'])
                    
                    src_folder = f"{model_folder}src/"
                    for file_name in ['__init__', 'config', 'model']:
                        if file_name in source:
                            zf.writestr(f"{src_folder}{file_name}.py", source[file_name])
                

                zf.writestr(resource_path, json.dumps(resource_config, indent=2))

    return temp_file.name