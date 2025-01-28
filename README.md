# AI Template Editor

![Template Management System Logo](TemplateEditorIcon.webp)

## 🚀 Overview

**AI Template Editor** is a full-stack application designed to create, manage, and publish templates with advanced features like version control, AI-powered suggestions, and dynamic JSON editing.

## 🔧 Technologies Used

- **Backend**: FastAPI (Python)
- **Frontend**: React.js
- **Database**: SQL
- **AI Integration**: OpenAI API

## ✨ Key Features

✅ **Version Control** - Track and manage template changes efficiently.

✅ **AI-Powered Suggestions** - Leverage OpenAI API for smart auto-completions and recommendations.

✅ **Dynamic JSON Editor** - User-friendly JSON editor with schema validation and auto-formatting.

✅ **Secure & Scalable** - JWT-based authentication, role-based access control, and structured SQL database.

## 🛠️ How It Works

1. **Build REST APIs** - FastAPI handles template and version management.
2. **Dynamic UI** - React-based interface for seamless user experience.
3. **AI-Powered Enhancements** - AI-driven autocomplete and smart suggestions.
4. **Robust JSON Editor** - Enables easy configuration and validation.
5. **Security & Scalability** - JWT authentication and structured SQL database.

## 📂 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-template-editor.git
cd ai-template-editor

# Install backend dependencies
pip install -r backend/requirements.txt

# Install frontend dependencies
cd frontend
npm install

# Run the backend
cd ../backend
uvicorn main:app --reload

# Run the frontend
cd ../frontend
npm start
```
## 📖 Template Editor Guide

### Template Creation
Create new templates by defining a collection of resources. Each resource supports custom JSON configurations.

### Resource Management
Add resources using the 'Add New Resource' form. Specify resource name, type, and configure JSON settings using the built-in editor.

### Template Publishing
Publish templates to the DLT platform using the 'Publish Workspace' button. All configurations are validated before publishing.

### Version Control
Track changes using the version control feature. Compare different versions using the diff view to see modifications.

### Import/Export
Share templates by exporting them as .zip files. Import existing templates to reuse configurations.
