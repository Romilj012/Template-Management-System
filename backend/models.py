# 11/19 10:57
# from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLAlchemyEnum, JSON, ForeignKey
# from sqlalchemy.orm import relationship
# from database import Base
# import enum
# from datetime import datetime

# class TemplateStatus(enum.Enum):
#     DRAFT = "draft"
#     PUBLISHED = "published"

# class ResourceType(enum.Enum):
#     DASHBOARD = "DASHBOARD"
#     DATASTORE = "DATASTORE"
#     METRIC = "METRIC"
#     ALERT = "ALERT"
#     FEATURESTORE = "FEATURESTORE"
#     INFERENCESTORE = "INFERENCESTORE"
#     MODEL = "MODEL"

# class Template(Base):
#     __tablename__ = "templates"

#     id = Column(String, primary_key=True, index=True)
#     name = Column(String, index=True)
#     description = Column(String)
#     tags = Column(JSON)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#     version = Column(Integer, default=1)
#     status = Column(SQLAlchemyEnum(TemplateStatus))
#     resources = relationship("Resource", back_populates="template")
# class Resource(Base):
#     __tablename__ = "resources"

#     id = Column(String, primary_key=True, index=True)
#     name = Column(String, index=True)
#     type = Column(SQLAlchemyEnum(ResourceType))
#     config = Column(JSON)
#     template_id = Column(String, ForeignKey("templates.id"))
#     template = relationship("Template", back_populates="resources")

# 11/22 7:57
# from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLAlchemyEnum, JSON, ForeignKey
# from sqlalchemy.orm import relationship
# from database import Base
# import enum
# from datetime import datetime

# class TemplateStatus(enum.Enum):
#     DRAFT = "draft"
#     PUBLISHED = "published"

# class ResourceType(enum.Enum):
#     DASHBOARD = "DASHBOARD"
#     DATASTORE = "DATASTORE"
#     METRIC = "METRIC"
#     ALERT = "ALERT"
#     FEATURESTORE = "FEATURESTORE"
#     INFERENCESTORE = "INFERENCESTORE"
#     MODEL = "MODEL"



# class Template(Base):
#     __tablename__ = "templates"

#     id = Column(String, primary_key=True, index=True)
#     displayName = Column(String, index=True)
#     description = Column(String)
#     tags = Column(JSON)
#     created_at = Column(DateTime, default=datetime.utcnow)
#     updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#     version = Column(Integer, default=1)
#     status = Column(SQLAlchemyEnum(TemplateStatus))
#     resources = relationship("Resource", back_populates="template")
    
# class Resource(Base):
#     __tablename__ = "resources"

#     id = Column(String, primary_key=True, index=True)
#     name = Column(String, index=True)
#     type = Column(SQLAlchemyEnum(ResourceType))
#     config = Column(JSON)
#     template_id = Column(String, ForeignKey("templates.id"))
#     template = relationship("Template", back_populates="resources")



from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLAlchemyEnum, JSON, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import enum
from datetime import datetime

class TemplateStatus(enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"

class ResourceType(enum.Enum):
    DASHBOARD = "DASHBOARD"
    DATASTORE = "DATASTORE"
    METRIC = "METRIC"
    ALERT = "ALERT"
    FEATURESTORE = "FEATURESTORE"
    INFERENCESTORE = "INFERENCESTORE"
    MODEL = "MODEL"



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
    resources = relationship("Resource", back_populates="template")
    versions = relationship("TemplateVersion", back_populates="template")
    
class Resource(Base):
    __tablename__ = "resources"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(SQLAlchemyEnum(ResourceType))
    config = Column(JSON)
    template_id = Column(String, ForeignKey("templates.id"))

    def dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type.value,
            "config": self.config,
            "template_id": self.template_id
        }


    template = relationship("Template", back_populates="resources")


class TemplateVersion(Base):
    __tablename__ = "template_versions"

    id = Column(Integer, primary_key=True, index=True)
    template_id = Column(String, ForeignKey("templates.id"))
    version = Column(Integer)
    content = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    displayName = Column(String)  # Store the version name

    template = relationship("Template", back_populates="versions")