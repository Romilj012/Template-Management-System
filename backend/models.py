from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLAlchemyEnum, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class ResourceType(enum.Enum):
    DASHBOARD = "DASHBOARD"
    DATASTORE = "DATASTORE"
    METRIC = "METRIC"
    ALERT = "ALERT"
    FEATURESTORE = "FEATURESTORE"
    INFERENCESTORE = "INFERENCESTORE"
    MODEL = "MODEL"

class TemplateStatus(enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"


class Template(Base):
    __tablename__ = "templates"

    id = Column(String, primary_key=True, index=True)
    displayName = Column(String, index=True)
    description = Column(String)
    tags = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    version = Column(Integer, default=1)
    status = Column(SQLAlchemyEnum(TemplateStatus))
    published_url = Column(String)
    resources = relationship("Resource", back_populates="template")
    versions = relationship("TemplateVersion", back_populates="template")
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="templates")


class Resource(Base):
    __tablename__ = "resources"

    id = Column(String, primary_key=True, index=True)
    key = Column(String, index=True)
    displayName = Column(String)
    description = Column(String)
    type = Column(SQLAlchemyEnum(ResourceType))
    config = Column(JSON)
    template_id = Column(String, ForeignKey("templates.id"))

    template = relationship("Template", back_populates="resources")

class TemplateVersion(Base):
    __tablename__ = "template_versions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    template_id = Column(String, ForeignKey("templates.id"))
    version = Column(Integer)
    content = Column(JSON)
    data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    displayName = Column(String)

    template = relationship("Template", back_populates="versions")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    templates = relationship("Template", back_populates="user")
