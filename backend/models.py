from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLAlchemyEnum, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class TemplateStatus(enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"

class ResourceType(enum.Enum):
    DASHBOARD = "dashboard"
    DATASTORE = "datastore"
    METRIC = "metric"
    ALERT = "alert"
    FEATURESTORE = "featurestore"
    INFERENCESTORE = "inferencestore"
    MODEL = "model"

class Template(Base):
    __tablename__ = "templates"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    tags = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    version = Column(Integer, default=1)
    status = Column(SQLAlchemyEnum(TemplateStatus))
    resources = relationship("Resource", back_populates="template")
class Resource(Base):
    __tablename__ = "resources"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(SQLAlchemyEnum(ResourceType))
    config = Column(JSON)
    template_id = Column(String, ForeignKey("templates.id"))
    template = relationship("Template", back_populates="resources")



