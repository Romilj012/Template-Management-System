from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime
from enum import Enum

class TemplateStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"

class ResourceBase(BaseModel):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"

class ResourceBase(BaseModel):
    name: str
    type: ResourceType
    config: Dict[str, Any]
    folder_ids: List[str]
    schema: Dict[str, Any]

class ResourceCreate(ResourceBase):
    pass

class Resource(ResourceBase):
    id: str
    template_id: str

    class Config:
        orm_mode = True

class TemplateBase(BaseModel):
    name: str
    description: str
    config: Dict[str, Any]
    status: TemplateStatus

class TemplateCreate(TemplateBase):
    pass

class Template(TemplateBase):
    id: str
    resources: List[Resource]
    created_at: datetime
    updated_at: datetime
    version: int

    class Config:
        orm_mode = True