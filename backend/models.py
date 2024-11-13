from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Template(Base):
    __tablename__ = "templates"
    id  = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    config = Column(JSON)
    resources = relationship("Resource", back_populates="template")

class Resource(Base):
    __tablename__ = "resources"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    config = Column(JSON)
    template_id = Column(Integer, ForeignKey("template.id"))
    template = relationship("Template", back_populates="resources")

