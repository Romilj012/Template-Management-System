from pydantic import BaseModel, validator, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import json

class TemplateStatus(Enum):
    DRAFT = "draft"
    PUBLISHED = "published"

class ResourceType(str, Enum):
    DASHBOARD = "DASHBOARD"
    DATASTORE = "DATASTORE"
    METRIC = "METRIC"
    ALERT = "ALERT"
    FEATURESTORE = "FEATURESTORE"
    INFERENCESTORE = "INFERENCESTORE"
    MODEL = "MODEL"

class ResourceBase(BaseModel):
    displayName: str
    type: ResourceType
    config: Dict[str, Any]

class ResourceCreate(ResourceBase):
    pass

    class Config:
        extra = "allow"

class ResourceUpdate(ResourceBase):
    pass

class Resource(ResourceBase):
    id: str
    template_id: str

    class Config:
        from_attributes = True

class TemplateBase(BaseModel):
    displayName: str
    description: str
    tags: List[str]

class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(BaseModel):
    displayName: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

class Template(TemplateBase):
    id: str
    created_at: datetime
    updated_at: datetime
    version: int
    published_url: Optional[str] = None
    resources: List[Resource] = []
    versions: List['TemplateVersion'] = []

    @validator('tags', pre=True)
    def parse_tags(cls, value):
        if isinstance(value, str):
            return json.loads(value)
        return value

    class Config:
        from_attributes = True

class TemplateImport(BaseModel):
    id: str
    displayName: str
    description: str
    tags: List[str]
    resources: List[ResourceBase]

    @validator('displayName', pre=True)
    def map_display_name(cls, v, values):
        if 'displayName' in values:
            return values.pop('displayName')
        return v

class TemplateVersion(BaseModel):
    id: int
    template_id: str
    version: int
    content: Dict[str, Any]
    created_at: datetime
    displayName: str

    class Config:
        from_attributes = True

class ModelSource(BaseModel):
    requirements: Optional[str]
    init: Optional[str]
    config: Optional[str]
    model: Optional[str]

class UsecaseSchema(BaseModel):
    id: str
    displayName: str
    description: str
    tags: List[str]

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True

class User(UserInDB):
    pass

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: EmailStr | None = None
