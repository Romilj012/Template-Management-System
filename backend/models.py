from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
import enum
from datetime import datetime

class TemplateStauts(enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"

class ResourceType(enum.Enum):
    TEXT = "text"
    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"

class Template(Base):
    __tablename__ = "templates"
    id  = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    config = Column(JSON)
    created_at = Column(DataTime, default = datetime.utcnow)
    updated_at = Column(DateTime, default = datetime.utcnow, onupdate=datetime.utcnow)
    version = Column(Integer, default=1)
    status = Column(Enum(TemplateStatus))
    resources = relationship("Resource", back_populates="template")

class Resource(Base):
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(Enum(ResourceType))
    config = Column(JSON)
    folder_ids = Column(JSON)
    schema = Column(JSON)
    template_id = Column(Integer, ForeignKey("template.id"))
    template = relationship("Template", back_populates="resources")

