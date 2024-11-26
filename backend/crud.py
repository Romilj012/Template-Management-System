from sqlalchemy.orm import Session
import models, schemas
import uuid
from datetime import datetime
from typing import Optional
import json, os, httpx
import auth, requests, zipfile, tempfile



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

async def publish_template(db: Session, template_id: str, x_nix_wid: Optional[int] = None):
    API_KEY = ""
    PRODUCTION_URL = "https://dev.test.neuralix.ai/api"
    
    db_template = get_template(db, template_id)
    if db_template:
        usecase_data = {
            "id": template_id,
            "displayName": db_template.displayName,
            "description": db_template.description,
            "tags": db_template.tags,
            "resources": [
                {
                    "displayName": resource.displayName,
                    "type": resource.type,
                    "config": resource.config
                } for resource in db_template.resources
            ]
        }

        with tempfile.NamedTemporaryFile(suffix='.nixdlt', mode='w+', delete=False) as temp_file:
            json.dump(usecase_data, temp_file, indent=2)
            temp_file_path = temp_file.name

        try:
            async with httpx.AsyncClient() as client:
                files = {'file': ('template.nixdlt', open(temp_file_path, 'rb'), 'application/octet-stream')}
                headers = {
                    'Authorization': f'Bearer {API_KEY}'
                }
                if x_nix_wid:
                    headers['x-nix-wid'] = str(x_nix_wid)

                response = await client.post(
                    f'{PRODUCTION_URL}/usecases',
                    files=files,
                    headers=headers
                )

                if response.status_code == 200:
                    db_template.status = "PUBLISHED"
                    db_template.updated_at = datetime.utcnow()
                    db_template.version += 1
                    db.commit()
                    db.refresh(db_template)
                    return db_template
                else:
                    raise Exception(f"Publication failed: {response.text}")
        finally:
            os.unlink(temp_file_path)
    return None
def import_template_with_resources(db: Session, template_data: schemas.TemplateImport):
    existing_template = db.query(models.Template).filter(models.Template.id == template_data.id).first()
    if existing_template:
        existing_template.displayName = template_data.displayName  
        existing_template.description = template_data.description
        existing_template.tags = template_data.tags
        existing_template.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(existing_template)
        return existing_template

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


def delete_resource(db: Session, resource_id: str):
    db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if db_resource:
        db.delete(db_resource)
        db.commit()
        return True
    return False

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

    for resource in template_data.resources:
        existing_resource = db.query(models.Resource).filter(
            models.Resource.template_id == existing_template.id,
            models.Resource.displayName == resource.displayName
        ).first()

        if existing_resource:
            existing_resource.type = models.ResourceType[resource.type]
            existing_resource.config = resource.config
        else:
            db_resource = models.Resource(
                id=str(uuid.uuid4()),
                displayName=resource.displayName,
                type=models.ResourceType[resource.type],
                config=resource.config,
                template_id=existing_template.id
            )
            db.add(db_resource)

    db.commit()
    return existing_template

def create_template_version(db: Session, template: models.Template):
    template_content = {
        "id": template.id,
        "displayName": template.displayName,
        "description": template.description,
        "tags": template.tags,
        "resources": [
            {
                "id": resource.id,
                "displayName": resource.displayName,
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

def unpack_template(file_path: str):
    _, file_extension = os.path.splitext(file_path)

    with zipfile.ZipFile(file_path, 'r') as zf:
        config_file_name = next((name for name in zf.namelist() if name.endswith('/config.json') and name.count('/') == 1), None)
        if not config_file_name:
            raise ValueError("Missing config.json in the archive file")
        
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
                    resource_key = parts[-2]
                    
                    with zf.open(name) as resource_file:
                        resource_config = json.load(resource_file)
                    
                    resource = {
                        "key": resource_key,
                        "displayName": resource_config.get('displayName', resource_key),
                        "type": resource_type[:-1].upper(),
                        "config": resource_config
                    }
                    
                    if resource_type == 'models':
                        source = {}
                        model_folder = f"{template_config['displayName']}/types/models/{resource_key}/"
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
                resource_name = resource.get('displayName') or resource.get('key') or f"resource_{resource['id']}"
                resource_path = f"{template_name}/types/{resource['type'].lower()}s/{resource_name}/config.json"
                resource_config = resource['config'].copy()
                
                if resource['type'] == 'MODEL' and 'source' in resource_config:
                    source = resource_config.pop('source')
                    model_folder = f"{template_name}/types/models/{resource_name}/"
                    
                    if 'requirements' in source:
                        zf.writestr(f"{model_folder}requirements.txt", source['requirements'])
                    
                    src_folder = f"{model_folder}src/"
                    for file_name in ['__init__', 'config', 'model']:
                        if file_name in source:
                            zf.writestr(f"{src_folder}{file_name}.py", source[file_name])

                zf.writestr(resource_path, json.dumps(resource_config, indent=2))

    return temp_file.name

def get_user_by_email(db: Session, email: str):
    
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user





    
