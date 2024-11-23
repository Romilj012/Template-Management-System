# from pydantic import BaseModel, validator
# from typing import List, Optional, Dict, Any
# from datetime import datetime
# from enum import Enum
# import json

# class TemplateStatus(str, Enum):
#     DRAFT = "draft"
#     PUBLISHED = "published"

# class ResourceBase(BaseModel):
#     name: str
#     type: str
#     config: Dict[str, Any]

# class ResourceCreate(ResourceBase):
#     pass

# class ResourceUpdate(ResourceBase):
#     pass

# class Resource(ResourceBase):
#     id: str
#     template_id: str

#     class Config:
#         from_attributes = True

# class TemplateBase(BaseModel):
#     name: str
#     description: str
#     tags: List[str]


# class ResourceImport(BaseModel):
#     name: str
#     type: str
#     config: Dict[str, Any]

# class TemplateImport(BaseModel):
#     id: str
#     name: str
#     description: str
#     tags: List[str]
#     resources: List[ResourceImport]

#     @validator('name', pre=True)
#     def map_display_name(cls, v, values):
#         if 'displayName' in values:
#             return values.pop('displayName')
#         return v
# class TemplateCreate(TemplateBase):
#     pass

# class TemplateUpdate(BaseModel):
#     name: Optional[str] = None
#     description: Optional[str] = None
#     tags: Optional[List[str]] = None

# class Template(TemplateBase):
#     id: str
#     # status: TemplateStatus
#     created_at: datetime
#     updated_at: datetime
#     version: int
#     published_url: Optional[str] = None
#     resources: List[Resource] = []
#     @validator('tags', pre=True)
#     def parse_tags(cls, value):
#         if isinstance(value, str):
#             return json.loads(value)
#         return value


#     class Config:
#         from_attributes = True

# class ResourceType(str, Enum):
#     DASHBOARD = "DASHBOARD"
#     DATASTORE = "DATASTORE"
#     METRIC = "METRIC"
#     ALERT = "ALERT"
#     FEATURESTORE = "FEATURESTORE"
#     INFERENCESTORE = "INFERENCESTORE"
#     MODEL = "MODEL"

# class ResourceBase(BaseModel):
#     name: str
#     type: ResourceType
#     config: Dict[str, Any]

# class ResourceCreate(ResourceBase):
#     pass

# class ResourceUpdate(ResourceBase):
#     pass

# class Resource(ResourceBase):
#     id: str
#     template_id: str

#     class Config:
#         from_attributes = True

# class TemplateBase(BaseModel):
#     name: str
#     description: str
#     tags: List[str]

# class TemplateCreate(TemplateBase):
#     pass

# class TemplateUpdate(BaseModel):
#     name: Optional[str] = None
#     description: Optional[str] = None
#     tags: Optional[List[str]] = None

# class Template(TemplateBase):
#     id: str
#     # status: TemplateStatus
#     created_at: datetime
#     updated_at: datetime
#     version: int
#     published_url: Optional[str] = None
#     resources: List[Resource] = []

#     @validator('tags', pre=True)
#     def parse_tags(cls, value):
#         if isinstance(value, str):
#             return json.loads(value)
#         return value

#     class Config:
#         from_attributes = True

# class TemplateImport(BaseModel):
#     id: str
#     name: str
#     description: str
#     tags: List[str]
#     resources: List[ResourceBase]

# class ModelSource(BaseModel):
#     requirements: Optional[str]
#     init: Optional[str]
#     config: Optional[str]
#     model: Optional[str]

# class UsecaseSchema(BaseModel):
#     id: str
#     displayName: str
#     description: str
#     tags: List[str]

#     class Config:
#         from_attributes = True

#11/22 7:40
# from pydantic import BaseModel, validator
# from typing import List, Optional, Dict, Any
# from datetime import datetime
# from enum import Enum
# import json

# class TemplateStatus(str, Enum):
#     DRAFT = "draft"
#     PUBLISHED = "published"

# class ResourceBase(BaseModel):
#     name: str
#     type: str
#     config: Dict[str, Any]

# class ResourceCreate(ResourceBase):
#     pass

#     class Config:
#         extra = "allow"

# class Resource(ResourceBase):
#     id: str
#     template_id: str

#     class Config:
#         from_attributes = True

# class TemplateBase(BaseModel):
#     displayName: str
#     description: str
#     tags: List[str]


# class ResourceImport(BaseModel):
#     name: str
#     type: str
#     config: Dict[str, Any]

# class TemplateImport(BaseModel):
#     id: str
#     displayName: str
#     description: str
#     tags: List[str]
#     resources: List[ResourceImport]

#     @validator('displayName', pre=True)
#     def map_display_name(cls, v, values):
#         if 'displayName' in values:
#             return values.pop('displayName')
#         return v
# class TemplateCreate(TemplateBase):
#     pass

# class TemplateUpdate(BaseModel):
#     displayName: Optional[str] = None
#     description: Optional[str] = None
#     tags: Optional[List[str]] = None

# class Template(TemplateBase):
#     id: str
#     # status: TemplateStatus
#     created_at: datetime
#     updated_at: datetime
#     version: int
#     published_url: Optional[str] = None
#     resources: List[Resource] = []
#     @validator('tags', pre=True)
#     def parse_tags(cls, value):
#         if isinstance(value, str):
#             return json.loads(value)
#         return value


#     class Config:
#         from_attributes = True

# class ResourceType(str, Enum):
#     DASHBOARD = "DASHBOARD"
#     DATASTORE = "DATASTORE"
#     METRIC = "METRIC"
#     ALERT = "ALERT"
#     FEATURESTORE = "FEATURESTORE"
#     INFERENCESTORE = "INFERENCESTORE"
#     MODEL = "MODEL"

# class ResourceBase(BaseModel):
#     name: str
#     type: ResourceType
#     config: Dict[str, Any]

# class ResourceCreate(ResourceBase):
#     pass

# class ResourceUpdate(ResourceBase):
#     pass

# class Resource(ResourceBase):
#     id: str
#     template_id: str

#     class Config:
#         from_attributes = True

# class TemplateBase(BaseModel):
#     displayName: str
#     description: str
#     tags: List[str]

# class TemplateCreate(TemplateBase):
#     pass

# class TemplateUpdate(BaseModel):
#     displayName: Optional[str] = None
#     description: Optional[str] = None
#     tags: Optional[List[str]] = None

# class Template(TemplateBase):
#     id: str
#     # status: TemplateStatus
#     created_at: datetime
#     updated_at: datetime
#     version: int
#     published_url: Optional[str] = None
#     resources: List[Resource] = []

#     @validator('tags', pre=True)
#     def parse_tags(cls, value):
#         if isinstance(value, str):
#             return json.loads(value)
#         return value

#     class Config:
#         from_attributes = True

# class TemplateImport(BaseModel):
#     id: str
#     displayName: str
#     description: str
#     tags: List[str]
#     resources: List[ResourceBase]

# class ModelSource(BaseModel):
#     requirements: Optional[str]
#     init: Optional[str]
#     config: Optional[str]
#     model: Optional[str]

# class UsecaseSchema(BaseModel):
#     id: str
#     displayName: str
#     description: str
#     tags: List[str]

#     class Config:
#         from_attributes = True

# class TemplateVersion(BaseModel):
#     id: int
#     template_id: str
#     version: int
#     content: Dict[str, Any]
#     created_at: datetime

#     class Config:
#         from_attributes = True




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

    class Config:
        extra = "allow"

class Resource(ResourceBase):
    id: str
    template_id: str

    class Config:
        from_attributes = True

class TemplateBase(BaseModel):
    displayName: str
    description: str
    tags: List[str]


class ResourceImport(BaseModel):
    name: str
    type: str
    config: Dict[str, Any]

class TemplateImport(BaseModel):
    id: str
    displayName: str
    description: str
    tags: List[str]
    resources: List[ResourceImport]

    @validator('displayName', pre=True)
    def map_display_name(cls, v, values):
        if 'displayName' in values:
            return values.pop('displayName')
        return v
class TemplateCreate(TemplateBase):
    pass

class TemplateUpdate(BaseModel):
    displayName: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None


class TemplateVersion(BaseModel):
    id: int
    template_id: str
    version: int
    content: Dict[str, Any]
    created_at: datetime
    displayName: str

    class Config:
        from_attributes = True

class Template(TemplateBase):
    id: str
    # status: TemplateStatus
    created_at: datetime
    updated_at: datetime
    version: int
    published_url: Optional[str] = None
    resources: List[Resource] = []
    versions: List[TemplateVersion] = []
    @validator('tags', pre=True)
    def parse_tags(cls, value):
        if isinstance(value, str):
            return json.loads(value)
        return value


    class Config:
        from_attributes = True

class ResourceType(str, Enum):
    DASHBOARD = "DASHBOARD"
    DATASTORE = "DATASTORE"
    METRIC = "METRIC"
    ALERT = "ALERT"
    FEATURESTORE = "FEATURESTORE"
    INFERENCESTORE = "INFERENCESTORE"
    MODEL = "MODEL"

class ResourceBase(BaseModel):
    name: str
    type: ResourceType
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

class TemplateImport(BaseModel):
    id: str
    displayName: str
    description: str
    tags: List[str]
    resources: List[ResourceBase]

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

class TemplateVersion(BaseModel):
    id: int
    template_id: str
    version: int
    content: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

