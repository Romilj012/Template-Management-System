from pydantic import BaseModel, validator
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import json

class TemplateStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"

class ResourceBase(BaseModel):
    name: str
    type: str
    config: Dict[str, Any]

class ResourceCreate(ResourceBase):
    pass

class ResourceUpdate(ResourceBase):
    pass

class Resource(ResourceBase):
    id: str
    template_id: str

    class Config:
        from_attributes = True

class TemplateBase(BaseModel):
    name: str
    description: str
    tags: List[str]

class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

class Template(TemplateBase):
    id: str
    # status: TemplateStatus
    created_at: datetime
    updated_at: datetime
    version: int
    published_url: Optional[str] = None
    resources: List[Resource] = []
    @validator('tags', pre=True)
    def parse_tags(cls, value):
        if isinstance(value, str):
            return json.loads(value)
        return value


    class Config:
        from_attributes = True
