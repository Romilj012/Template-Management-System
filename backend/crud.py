from sqlalchemy.orm import Session
from . import models, schemas
import uuid
from datetime import datetime

def get_template(db: Session, template_id: str):
    return db.query(models.Template).filter(models.Template.id == template_id).first()

def get_templates(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Template).offset(skip).limit(limit).all()

def create_template(db: Session, template: schemas.TemplateCreate):
    db_template = models.Template(id=str(uuid.uuid4()), **template.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def update_template(db: Session, template_id: str, template: schemas.TemplateCreate):
    db_template = db.query(models.Template).filter(models.Template.id == template_id).first()
    if db_template:
        update_data = template.dict(exclude_unset=True)
        update_data['updated_at'] = datetime.utcnow()
        update_data['version'] = db_template.version + 1
        for key, value in update_data.items():
            setattr(db_template, key, value)
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

def update_resource(db: Session, resource_id: str, resource: schemas.ResourceCreate):
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