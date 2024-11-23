# 11/20 3:48
# from sqlalchemy.orm import Session
# import models, schemas
# import uuid
# from datetime import datetime
# import json

# # ... (keep existing functions)
# def get_template(db: Session, template_id: str):
#     return db.query(models.Template).filter(models.Template.id == template_id).first()

# def get_templates(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(models.Template).offset(skip).limit(limit).all()

# def create_template(db: Session, template: schemas.TemplateCreate):
#     template_dict = template.dict()
#     db_template = models.Template(id=str(uuid.uuid4()), **template_dict)
#     db.add(db_template)
#     db.commit()
#     db.refresh(db_template)
#     return db_template

# def update_template(db: Session, template_id: str, template: schemas.TemplateUpdate):
#     db_template = db.query(models.Template).filter(models.Template.id == template_id).first()
#     if db_template:
#         update_data = template.dict(exclude_unset=True)
#         update_data['updated_at'] = datetime.utcnow()
#         update_data['version'] = db_template.version + 1
#         for key, value in update_data.items():
#             setattr(db_template, key, value)
#         db.commit()
#         db.refresh(db_template)
#     return db_template

# def delete_template(db: Session, template_id: str):
#     db_template = db.query(models.Template).filter(models.Template.id == template_id).first()
#     if db_template:
#         db.delete(db_template)
#         db.commit()
#         return True
#     return False

# def create_resource(db: Session, resource: schemas.ResourceCreate, template_id: str):
#     db_resource = models.Resource(id=str(uuid.uuid4()), **resource.dict(), template_id=template_id)
#     db.add(db_resource)
#     db.commit()
#     db.refresh(db_resource)
#     return db_resource

# def update_resource(db: Session, resource_id: str, resource: schemas.ResourceUpdate):
#     db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
#     if db_resource:
#         update_data = resource.dict(exclude_unset=True)
#         for key, value in update_data.items():
#             setattr(db_resource, key, value)
#         db.commit()
#         db.refresh(db_resource)
#     return db_resource

# def delete_resource(db: Session, resource_id: str):
#     db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
#     if db_resource:
#         db.delete(db_resource)
#         db.commit()
#         return True
#     return False

# def publish_template(db: Session, template_id: str):
#     db_template = get_template(db, template_id)
#     if db_template:
#         db_template.status = models.TemplateStatus.PUBLISHED
#         db_template.published_url = f"/templates/{template_id}"
#         db.commit()
#         db.refresh(db_template)
#     return db_template

# def import_template_with_resources(db: Session, template_data: schemas.TemplateImport):
#     # Check if template with the same ID already exists
#     existing_template = db.query(models.Template).filter(models.Template.id == template_data.id).first()
    
#     if existing_template:
#         # Optionally update the existing template
#         existing_template.name = template_data.name
#         existing_template.description = template_data.description
#         existing_template.tags = template_data.tags
#         existing_template.updated_at = datetime.utcnow()
#         db.commit()
#         db.refresh(existing_template)
#         return existing_template
    
#     # Create new template if it doesn't exist
#     db_template = models.Template(
#         id=template_data.id,
#         name=template_data.name,
#         description=template_data.description,
#         tags=template_data.tags,
#         status=models.TemplateStatus.DRAFT,
#         created_at=datetime.utcnow(),
#         updated_at=datetime.utcnow()
#     )
    
#     db.add(db_template)
#     db.commit()
    
#     # Create resources
#     for resource in template_data.resources:
#         db_resource = models.Resource(
#             id=str(uuid.uuid4()),  # Generate new unique ID for resources
#             name=resource.name,
#             type=models.ResourceType[resource.type],
#             config=resource.config,
#             template_id=db_template.id
#         )
        
#         db.add(db_resource)
    
#     db.commit()
#     return db_template

# from sqlalchemy.orm import Session
# import models, schemas
# import uuid
# from datetime import datetime
# from utils import pack_template
# import json, os

# def get_template(db: Session, template_id: str):
#     return db.query(models.Template).filter(models.Template.id == template_id).first()

# def get_templates(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(models.Template).offset(skip).limit(limit).all()

# def create_template(db: Session, template: schemas.TemplateCreate):
#     template_dict = template.dict()
#     db_template = models.Template(id=str(uuid.uuid4()), **template_dict)
#     db.add(db_template)
#     db.commit()
#     db.refresh(db_template)
#     return db_template

# def create_template(db: Session, template: schemas.TemplateCreate):
#     template_dict = template.dict()
#     db_template = models.Template(id=str(uuid.uuid4()), **template_dict)
#     db.add(db_template)
#     db.commit()
#     db.refresh(db_template)
#     return db_template

# def publish_template(db: Session, template_id: str, key_name: str):
#     db_template = get_template(db, template_id)
#     if db_template:
#         db_template.status = models.TemplateStatus.PUBLISHED
#         config = {
#             "id": db_template.id,
#             "displayName": db_template.displayName,  # Changed from 'name' to 'displayName'
#             "description": db_template.description,
#             "tags": db_template.tags
#         }
#         config_json = json.dumps(config, indent=2)
#         db_template.published_url = f'https://dev.test.neuralix.ai/workspaces/api/{key_name}'
#         db_template.updated_at = datetime.utcnow()
#         db_template.version += 1
#         db.commit()
#         db.refresh(db_template)
#         return db_template, config_json
#     return None, None

# def import_template_with_resources(db: Session, template_data: schemas.TemplateImport):
#     existing_template = db.query(models.Template).filter(models.Template.id == template_data.id).first()
#     if existing_template:
#         existing_template.displayName = template_data.displayName  # Changed from 'name' to 'displayName'
#         existing_template.description = template_data.description
#         existing_template.tags = template_data.tags
#         existing_template.updated_at = datetime.utcnow()
#         db.commit()
#         db.refresh(existing_template)
#         return existing_template

#     db_template = models.Template(
#         id=template_data.id,
#         displayName=template_data.displayName,  # Changed from 'name' to 'displayName'
#         description=template_data.description,
#         tags=template_data.tags,
#         status=models.TemplateStatus.DRAFT,
#         created_at=datetime.utcnow(),
#         updated_at=datetime.utcnow()
#     )
#     db.add(db_template)
#     db.commit()
# def update_template(db: Session, template_id: str, template: schemas.TemplateUpdate):
#     db_template = db.query(models.Template).filter(models.Template.id == template_id).first()
#     if db_template:
#         update_data = template.dict(exclude_unset=True)
#         update_data['updated_at'] = datetime.utcnow()
#         update_data['version'] = db_template.version + 1
#         for key, value in update_data.items():
#             setattr(db_template, key, value)
#         db.commit()
#         db.refresh(db_template)
#     return db_template

# def delete_template(db: Session, template_id: str):
#     db_template = db.query(models.Template).filter(models.Template.id == template_id).first()
#     if db_template:
#         db.delete(db_template)
#         db.commit()
#         return True
#     return False

# def create_resource(db: Session, resource: schemas.ResourceCreate, template_id: str):
#     db_resource = models.Resource(id=str(uuid.uuid4()), **resource.dict(), template_id=template_id)
#     db.add(db_resource)
#     db.commit()
#     db.refresh(db_resource)
#     return db_resource

# def update_resource(db: Session, resource_id: str, resource: schemas.ResourceUpdate):
#     db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
#     if db_resource:
#         update_data = resource.dict(exclude_unset=True)
#         for key, value in update_data.items():
#             setattr(db_resource, key, value)
#         db.commit()
#         db.refresh(db_resource)
#     return db_resource

# def delete_resource(db: Session, resource_id: str):
#     db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
#     if db_resource:
#         db.delete(db_resource)
#         db.commit()
#         return True
#     return False

# # def publish_template(db: Session, template_id: str, key_name: str):
# #     db_template = get_template(db, template_id)
# #     if db_template:
# #         db_template.status = models.TemplateStatus.PUBLISHED
# #         db_template.key_name = key_name
# #         db_template.published_url = f'https://dev.test.neuralix.ai/workspaces/{key_name}'
# #         db_template.updated_at = datetime.utcnow()
# #         db_template.version += 1
# #         db.commit()
# #         db.refresh(db_template)
# #     return db_template

# # def publish_template(db: Session, template_id: str, key_name: str):
# #     db_template = get_template(db, template_id)
# #     if db_template:
# #         db_template.status = models.TemplateStatus.PUBLISHED
# #         # Create the config file content
# #         config = {
# #             "id": db_template.id,
# #             "displayName": db_template.name,
# #             "description": db_template.description,
# #             "tags": db_template.tags
# #         }
# #         # Convert config to JSON string
# #         config_json = json.dumps(config, indent=2)
# #         # Pack the template into a .nixdlt file
# #         nixdlt_file_path = pack_template(config)
# #         # Here you would typically upload the .nixdlt file
# #         db_template.published_url = f'https://dev.test.neuralix.ai/workspaces/api/{key_name}'
# #         db_template.updated_at = datetime.utcnow()
# #         db_template.version += 1
# #         db.commit()
# #         db.refresh(db_template)
# #         return db_template, config_json
# #     return None, None

# def publish_template(db: Session, template_id: str, key_name: str):
#     db_template = get_template(db, template_id)
#     if db_template:
#         db_template.status = models.TemplateStatus.PUBLISHED
#         config = {
#             "id": db_template.id,
#             "displayName": db_template.name,
#             "description": db_template.description,
#             "tags": db_template.tags
#         }
#         config_json = json.dumps(config, indent=2)
#         db_template.published_url = f'https://dev.test.neuralix.ai/api/{key_name}'
#         db_template.updated_at = datetime.utcnow()
#         db_template.version += 1
#         db.commit()
#         db.refresh(db_template)
#         return db_template, config_json
#     return None, None

# def import_template_with_resources(db: Session, template_data: schemas.TemplateImport):
#     # Check if template with the same ID already exists
#     existing_template = db.query(models.Template).filter(models.Template.id == template_data.id).first()
    
#     if existing_template:
#         # Optionally update the existing template
#         existing_template.name = template_data.name
#         existing_template.description = template_data.description
#         existing_template.tags = template_data.tags
#         existing_template.updated_at = datetime.utcnow()
#         db.commit()
#         db.refresh(existing_template)
#         return existing_template
    
#     # Create new template if it doesn't exist
#     db_template = models.Template(
#         id=template_data.id,
#         name=template_data.name,
#         description=template_data.description,
#         tags=template_data.tags,
#         status=models.TemplateStatus.DRAFT,
#         created_at=datetime.utcnow(),
#         updated_at=datetime.utcnow()
#     )
    
#     db.add(db_template)
#     db.commit()
    
#     # Create resources
#     for resource in template_data.resources:
#         db_resource = models.Resource(
#             id=str(uuid.uuid4()),  # Generate new unique ID for resources
#             name=resource.name,
#             type=models.ResourceType[resource.type],
#             config=resource.config,
#             template_id=db_template.id
#         )
        
#         db.add(db_resource)
    
#     db.commit()
#     return db_template

#11/22 5:14
# from sqlalchemy.orm import Session
# import models, schemas
# import uuid
# from datetime import datetime
# from utils import pack_template
# import json, os

# # ... (keep existing functions)
# def get_template(db: Session, template_id: str):
#     return db.query(models.Template).filter(models.Template.id == template_id).first()

# def get_templates(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(models.Template).offset(skip).limit(limit).all()

# def create_template(db: Session, template: schemas.TemplateCreate):
#     template_dict = template.dict()
#     db_template = models.Template(id=str(uuid.uuid4()), **template_dict)
#     db.add(db_template)
#     db.commit()
#     db.refresh(db_template)
#     return db_template

# def publish_template(db: Session, template_id: str, key_name: str):
#     db_template = get_template(db, template_id)
#     if db_template:
#         db_template.status = models.TemplateStatus.PUBLISHED
#         config = {
#             "id": db_template.id,
#             "displayName": db_template.displayName,  # Changed from 'name' to 'displayName'
#             "description": db_template.description,
#             "tags": db_template.tags
#         }
#         config_json = json.dumps(config, indent=2)
#         db_template.published_url = f'https://dev.test.neuralix.ai/workspaces/api/{key_name}'
#         db_template.updated_at = datetime.utcnow()
#         db_template.version += 1
#         db.commit()
#         db.refresh(db_template)
#         return db_template, config_json
#     return None, None


# def import_template_with_resources(db: Session, template_data: schemas.TemplateImport):
#     existing_template = db.query(models.Template).filter(models.Template.id == template_data.id).first()
#     if existing_template:
#         existing_template.displayName = template_data.displayName  # Changed from 'name' to 'displayName'
#         existing_template.description = template_data.description
#         existing_template.tags = template_data.tags
#         existing_template.updated_at = datetime.utcnow()
#         db.commit()
#         db.refresh(existing_template)
#         return existing_template

#     db_template = models.Template(
#         id=template_data.id,
#         displayName=template_data.displayName,  # Changed from 'name' to 'displayName'
#         description=template_data.description,
#         tags=template_data.tags,
#         status=models.TemplateStatus.DRAFT,
#         created_at=datetime.utcnow(),
#         updated_at=datetime.utcnow()
#     )
#     db.add(db_template)
#     db.commit()
# def update_template(db: Session, template_id: str, template: schemas.TemplateUpdate):
#     db_template = db.query(models.Template).filter(models.Template.id == template_id).first()
#     if db_template:
#         update_data = template.dict(exclude_unset=True)
#         update_data['updated_at'] = datetime.utcnow()
#         update_data['version'] = db_template.version + 1
#         for key, value in update_data.items():
#             setattr(db_template, key, value)
#         db.commit()
#         db.refresh(db_template)
#     return db_template

# def delete_template(db: Session, template_id: str):
#     db_template = db.query(models.Template).filter(models.Template.id == template_id).first()
#     if db_template:
#         db.delete(db_template)
#         db.commit()
#         return True
#     return False

# def create_resource(db: Session, resource: schemas.ResourceCreate, template_id: str):
#     db_resource = models.Resource(id=str(uuid.uuid4()), **resource.dict(), template_id=template_id)
#     db.add(db_resource)
#     db.commit()
#     db.refresh(db_resource)
#     return db_resource

# def update_resource(db: Session, resource_id: str, resource: schemas.ResourceUpdate):
#     db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
#     if db_resource:
#         update_data = resource.dict(exclude_unset=True)
#         for key, value in update_data.items():
#             setattr(db_resource, key, value)
#         db.commit()
#         db.refresh(db_resource)
#     return db_resource

# # def update_resource(db: Session, resource_id: str, resource: schemas.ResourceUpdate):
# #     db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
# #     if db_resource:
# #         update_data = resource.dict(exclude_unset=True)
# #         if 'config' in update_data:
# #             # Preserve the existing source if it's not provided in the update
# #             if 'source' not in update_data['config'] and 'source' in db_resource.config:
# #                 update_data['config']['source'] = db_resource.config['source']
        
# #         for key, value in update_data.items():
# #             setattr(db_resource, key, value)
        
# #         db.commit()
# #         db.refresh(db_resource)
# #         return db_resource
# #     return None



# def delete_resource(db: Session, resource_id: str):
#     db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
#     if db_resource:
#         db.delete(db_resource)
#         db.commit()
#         return True
#     return False

# # def publish_template(db: Session, template_id: str, key_name: str):
# #     db_template = get_template(db, template_id)
# #     if db_template:
# #         db_template.status = models.TemplateStatus.PUBLISHED
# #         db_template.key_name = key_name
# #         db_template.published_url = f'https://dev.test.neuralix.ai/workspaces/{key_name}'
# #         db_template.updated_at = datetime.utcnow()
# #         db_template.version += 1
# #         db.commit()
# #         db.refresh(db_template)
# #     return db_template

# # def publish_template(db: Session, template_id: str, key_name: str):
# #     db_template = get_template(db, template_id)
# #     if db_template:
# #         db_template.status = models.TemplateStatus.PUBLISHED
# #         # Create the config file content
# #         config = {
# #             "id": db_template.id,
# #             "displayName": db_template.name,
# #             "description": db_template.description,
# #             "tags": db_template.tags
# #         }
# #         # Convert config to JSON string
# #         config_json = json.dumps(config, indent=2)
# #         # Pack the template into a .nixdlt file
# #         nixdlt_file_path = pack_template(config)
# #         # Here you would typically upload the .nixdlt file
# #         db_template.published_url = f'https://dev.test.neuralix.ai/workspaces/api/{key_name}'
# #         db_template.updated_at = datetime.utcnow()
# #         db_template.version += 1
# #         db.commit()
# #         db.refresh(db_template)
# #         return db_template, config_json
# #     return None, None

# def publish_template(db: Session, template_id: str, key_name: str):
#     db_template = get_template(db, template_id)
#     if db_template:
#         db_template.status = models.TemplateStatus.PUBLISHED
#         config = {
#             "id": db_template.id,
#             "displayName": db_template.displayName,
#             "description": db_template.description,
#             "tags": db_template.tags
#         }
#         config_json = json.dumps(config, indent=2)
#         db_template.published_url = f'https://dev.test.neuralix.ai/api/workspaces/{key_name}'
#         db_template.updated_at = datetime.utcnow()
#         db_template.version += 1
#         db.commit()
#         db.refresh(db_template)
#         return db_template, config_json
#     return None, None

# def import_template_with_resources(db: Session, template_data: schemas.TemplateImport):
#     existing_template = db.query(models.Template).filter(models.Template.id == template_data.id).first()
    
#     if existing_template:
#         existing_template.displayName = template_data.displayName
#         existing_template.description = template_data.description
#         existing_template.tags = template_data.tags
#         existing_template.updated_at = datetime.utcnow()
#         db.commit()
#         db.refresh(existing_template)
#     else:
#         db_template = models.Template(
#             id=template_data.id,
#             displayName=template_data.displayName,
#             description=template_data.description,
#             tags=template_data.tags,
#             status=models.TemplateStatus.DRAFT,
#             created_at=datetime.utcnow(),
#             updated_at=datetime.utcnow()
#         )
#         db.add(db_template)
#         db.commit()
#         existing_template = db_template

#     # Update or create resources
#     for resource in template_data.resources:
#         existing_resource = db.query(models.Resource).filter(
#             models.Resource.template_id == existing_template.id,
#             models.Resource.name == resource.name
#         ).first()

#         if existing_resource:
#             existing_resource.type = models.ResourceType[resource.type]
#             existing_resource.config = resource.config
#         else:
#             db_resource = models.Resource(
#                 id=str(uuid.uuid4()),
#                 name=resource.name,
#                 type=models.ResourceType[resource.type],
#                 config=resource.config,
#                 template_id=existing_template.id
#             )
#             db.add(db_resource)

#     db.commit()
#     return existing_template

# def get_template_versions(db: Session, template_id: str):
#     return db.query(models.TemplateVersion).filter(models.TemplateVersion.template_id == template_id).all()

# def get_template_version(db: Session, template_id: str, version: int):
#     return db.query(models.TemplateVersion).filter(
#         models.TemplateVersion.template_id == template_id,
#         models.TemplateVersion.version == version
#     ).first()

# def create_template_version(db: Session, template: models.Template):
#     db_version = models.TemplateVersion(
#         template_id=template.id,
#         version=template.version,
#         content=template.dict()  # Use dict() method to serialize the template
#     )
#     db.add(db_version)
#     db.commit()
#     db.refresh(db_version)
#     return db_version

# def update_template(db: Session, template_id: str, template: schemas.TemplateUpdate):
#     db_template = db.query(models.Template).filter(models.Template.id == template_id).first()
#     if db_template:
#         update_data = template.dict(exclude_unset=True)
#         update_data['updated_at'] = datetime.utcnow()
#         update_data['version'] = db_template.version + 1
#         for key, value in update_data.items():
#             setattr(db_template, key, value)
        
#         # Create a new version
#         create_template_version(db, db_template)
        
#         db.commit()
#         db.refresh(db_template)
#     return db_template



from sqlalchemy.orm import Session
import models, schemas
import uuid
from datetime import datetime
from utils import pack_template
import json, os

def get_template(db: Session, template_id: str):
    return db.query(models.Template).filter(models.Template.id == template_id).first()

def get_templates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Template).offset(skip).limit(limit).all()

def create_template(db: Session, template: schemas.TemplateCreate):
    template_dict = template.dict()
    db_template = models.Template(id=str(uuid.uuid4()), **template_dict)
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def publish_template(db: Session, template_id: str, key_name: str):
    db_template = get_template(db, template_id)
    if db_template:
        db_template.status = models.TemplateStatus.PUBLISHED
        config = {
            "id": db_template.id,
            "displayName": db_template.displayName,  # Changed from 'name' to 'displayName'
            "description": db_template.description,
            "tags": db_template.tags
        }
        config_json = json.dumps(config, indent=2)
        db_template.published_url = f'https://dev.test.neuralix.ai/workspaces/api/{key_name}'
        db_template.updated_at = datetime.utcnow()
        db_template.version += 1
        db.commit()
        db.refresh(db_template)
        return db_template, config_json
    return None, None


def import_template_with_resources(db: Session, template_data: schemas.TemplateImport):
    existing_template = db.query(models.Template).filter(models.Template.id == template_data.id).first()
    if existing_template:
        existing_template.displayName = template_data.displayName  # Changed from 'name' to 'displayName'
        existing_template.description = template_data.description
        existing_template.tags = template_data.tags
        existing_template.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_template)
        return existing_template

    db_template = models.Template(
        id=template_data.id,
        displayName=template_data.displayName,  # Changed from 'name' to 'displayName'
        description=template_data.description,
        tags=template_data.tags,
        status=models.TemplateStatus.DRAFT,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(db_template)
    db.commit()
def update_template(db: Session, template_id: str, template: schemas.TemplateUpdate):
    db_template = db.query(models.Template).filter(models.Template.id == template_id).first()
    if db_template:
        update_data = template.dict(exclude_unset=True)
        update_data['updated_at'] = datetime.utcnow()
        update_data['version'] = db_template.version + 1
        for key, value in update_data.items():
            setattr(db_template, key, value)
        create_template_version(db, db_template)
        db.commit()
        db.refresh(db_template)
    return db_template

def delete_template(db: Session, template_id: str):
    db_template = db.query(models.Template).filter(models.Template.id == template_id).first()
    if db_template:
        db.delete(db_template)
        db.commit()
        return True
    return False

def create_resource(db: Session, resource: schemas.ResourceCreate, template_id: str):
    db_resource = models.Resource(id=str(uuid.uuid4()), **resource.dict(), template_id=template_id)
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource

def update_resource(db: Session, resource_id: str, resource: schemas.ResourceUpdate):
    db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if db_resource:
        update_data = resource.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_resource, key, value)
        db.commit()
        db.refresh(db_resource)
    return db_resource

# def update_resource(db: Session, resource_id: str, resource: schemas.ResourceUpdate):
#     db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
#     if db_resource:
#         update_data = resource.dict(exclude_unset=True)
#         if 'config' in update_data:
#             # Preserve the existing source if it's not provided in the update
#             if 'source' not in update_data['config'] and 'source' in db_resource.config:
#                 update_data['config']['source'] = db_resource.config['source']
        
#         for key, value in update_data.items():
#             setattr(db_resource, key, value)
        
#         db.commit()
#         db.refresh(db_resource)
#         return db_resource
#     return None



def delete_resource(db: Session, resource_id: str):
    db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if db_resource:
        db.delete(db_resource)
        db.commit()
        return True
    return False

# def publish_template(db: Session, template_id: str, key_name: str):
#     db_template = get_template(db, template_id)
#     if db_template:
#         db_template.status = models.TemplateStatus.PUBLISHED
#         db_template.key_name = key_name
#         db_template.published_url = f'https://dev.test.neuralix.ai/workspaces/{key_name}'
#         db_template.updated_at = datetime.utcnow()
#         db_template.version += 1
#         db.commit()
#         db.refresh(db_template)
#     return db_template

# def publish_template(db: Session, template_id: str, key_name: str):
#     db_template = get_template(db, template_id)
#     if db_template:
#         db_template.status = models.TemplateStatus.PUBLISHED
#         # Create the config file content
#         config = {
#             "id": db_template.id,
#             "displayName": db_template.name,
#             "description": db_template.description,
#             "tags": db_template.tags
#         }
#         # Convert config to JSON string
#         config_json = json.dumps(config, indent=2)
#         # Pack the template into a .nixdlt file
#         nixdlt_file_path = pack_template(config)
#         # Here you would typically upload the .nixdlt file
#         db_template.published_url = f'https://dev.test.neuralix.ai/workspaces/api/{key_name}'
#         db_template.updated_at = datetime.utcnow()
#         db_template.version += 1
#         db.commit()
#         db.refresh(db_template)
#         return db_template, config_json
#     return None, None

def publish_template(db: Session, template_id: str, key_name: str):
    db_template = get_template(db, template_id)
    if db_template:
        db_template.status = models.TemplateStatus.PUBLISHED
        config = {
            "id": db_template.id,
            "displayName": db_template.displayName,
            "description": db_template.description,
            "tags": db_template.tags
        }
        config_json = json.dumps(config, indent=2)
        db_template.published_url = f'https://dev.test.neuralix.ai/api/workspaces/{key_name}'
        db_template.updated_at = datetime.utcnow()
        db_template.version += 1
        db.commit()
        db.refresh(db_template)
        return db_template, config_json
    return None, None

def import_template_with_resources(db: Session, template_data: schemas.TemplateImport):
    existing_template = db.query(models.Template).filter(models.Template.id == template_data.id).first()
    
    if existing_template:
        existing_template.displayName = template_data.displayName
        existing_template.description = template_data.description
        existing_template.tags = template_data.tags
        existing_template.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_template)
    else:
        db_template = models.Template(
            id=template_data.id,
            displayName=template_data.displayName,
            description=template_data.description,
            tags=template_data.tags,
            status=models.TemplateStatus.DRAFT,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(db_template)
        db.commit()
        existing_template = db_template

    # Update or create resources
    for resource in template_data.resources:
        existing_resource = db.query(models.Resource).filter(
            models.Resource.template_id == existing_template.id,
            models.Resource.name == resource.name
        ).first()

        if existing_resource:
            existing_resource.type = models.ResourceType[resource.type]
            existing_resource.config = resource.config
        else:
            db_resource = models.Resource(
                id=str(uuid.uuid4()),
                name=resource.name,
                type=models.ResourceType[resource.type],
                config=resource.config,
                template_id=existing_template.id
            )
            db.add(db_resource)

    db.commit()
    return existing_template

def create_template_version(db: Session, template: models.Template):
    # Create a serializable version of the template
    template_content = {
        "id": template.id,
        "displayName": template.displayName,
        "description": template.description,
        "tags": template.tags,
        "resources": [
            {
                "id": resource.id,
                "name": resource.name,
                "type": resource.type.value,
                "config": resource.config
            } for resource in template.resources
        ]
    }
    
    db_version = models.TemplateVersion(
        template_id=template.id,
        version=template.version,
        content=template_content,
        displayName=f"Version {template.version}"
    )
    db.add(db_version)
    db.commit()
    db.refresh(db_version)
    return db_version

def get_template_versions(db: Session, template_id: str):
    return db.query(models.TemplateVersion)\
        .filter(models.TemplateVersion.template_id == template_id)\
        .order_by(models.TemplateVersion.version.desc())\
        .all()

def get_template_version(db: Session, template_id: str, version: int):
    return db.query(models.TemplateVersion)\
        .filter(
            models.TemplateVersion.template_id == template_id,
            models.TemplateVersion.version == version
        ).first()


    