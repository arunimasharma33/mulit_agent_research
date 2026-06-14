# Development Guide

## Getting Started for Developers

This guide will help you set up your development environment and understand the development workflow.

## Prerequisites

- Python 3.9 or higher
- Node.js 18.x or higher
- npm 9.x or higher
- Git
- A code editor (VSCode recommended)

## Initial Setup

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd project_multiagent
```

### 2. Python Environment Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r req.txt
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

### 4. Environment Configuration
```bash
# Copy example to actual .env
cp .env.example .env

# Edit .env with your actual API keys
# Use a text editor to add:
# - OPENAI_API_KEY
# - MISTRAL_API_KEY
# - TAVILY_API_KEY
# - JWT_SECRET_KEY (generate: python -c "import secrets; print(secrets.token_urlsafe(32))")
```

## Development Workflow

### Running the Full Stack

**Option 1: Using Batch Scripts (Windows)**
```bash
# Full stack (frontend + backend)
start.bat

# Backend only
start-backend.bat
```

**Option 2: Manual Development**

Terminal 1 - Backend:
```bash
.venv\Scripts\activate
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8765
- **API Documentation**: http://localhost:8765/docs (Swagger UI)
- **Alternative API Docs**: http://localhost:8765/redoc (ReDoc)

## Code Structure and Conventions

### Backend Python Code

#### File Organization
```
backend/
├── main.py          # Route handlers, app setup
├── auth.py          # Authentication logic
├── database.py      # Database configuration
├── models.py        # SQLAlchemy ORM models
└── schemas.py       # Pydantic validation schemas
```

#### Naming Conventions
- Functions: `snake_case`
- Classes: `PascalCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Private functions: `_leading_underscore`

#### Example: Adding a New Route
```python
# In backend/main.py

from fastapi import APIRouter, Depends, HTTPException
from backend.auth import get_current_user
from backend.schemas import YourRequestSchema, YourResponseSchema

@app.post("/api/your-endpoint", response_model=YourResponseSchema)
async def your_endpoint(
    request: YourRequestSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Your implementation
    return your_response
```

### Frontend TypeScript/React Code

#### File Organization
```
frontend/src/
├── components/      # Functional components
├── api/            # API client functions
├── context/        # React Context
├── hooks/          # Custom hooks (if added)
└── types/          # TypeScript interfaces (if added)
```

#### Component Template
```typescript
import React from 'react';

interface ComponentProps {
  prop1: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<ComponentProps> = ({ prop1, onAction }) => {
  return (
    <div>
      {prop1}
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
};

export default MyComponent;
```

#### API Client Pattern
```typescript
// frontend/src/api/myfeature.ts
const BASE_URL = 'http://localhost:8765/api';

export const myFeatureApi = {
  getItem: async (id: string, token: string) => {
    const response = await fetch(`${BASE_URL}/my-feature/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }
};
```

## Common Development Tasks

### Adding a New API Endpoint

1. **Create Pydantic Schema** (`backend/schemas.py`)
```python
class NewFeatureRequest(BaseModel):
    field1: str
    field2: int

class NewFeatureResponse(BaseModel):
    id: int
    field1: str
    field2: int
```

2. **Add Route** (`backend/main.py`)
```python
@app.post("/api/new-feature", response_model=NewFeatureResponse)
async def create_feature(
    request: NewFeatureRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Implementation
    return feature
```

3. **Create Frontend API Client** (`frontend/src/api/newfeature.ts`)
```typescript
export const newFeatureApi = {
  create: async (data: NewFeatureRequest, token: string) => {
    const response = await fetch(`${BASE_URL}/new-feature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }
};
```

4. **Create React Component** (`frontend/src/components/NewFeature.tsx`)
```typescript
import { useState } from 'react';
import { newFeatureApi } from '../api/newfeature';

export const NewFeature: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  const handleCreate = async () => {
    setLoading(true);
    try {
      const result = await newFeatureApi.create({...}, token);
      // Handle result
    } finally {
      setLoading(false);
    }
  };
  
  return <div>...</div>;
};
```

### Modifying Agent Logic

1. **Update Agent** (`agents.py`)
```python
def build_custom_agent():
    return create_agent(
        model=llm,
        tools=[tool1, tool2],
        # Add custom configuration
    )
```

2. **Update Pipeline** (`pipeline.py`)
```python
def run_research_pipeline(topic: str, on_progress: ProgressCallback | None = None) -> dict:
    # Add new agent to pipeline
    custom_agent = build_custom_agent()
    result = custom_agent.invoke({...})
    # Emit progress
```

### Adding Database Models

1. **Create Model** (`backend/models.py`)
```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base

class MyModel(Base):
    __tablename__ = "my_models"
    
    id = Column(Integer, primary_key=True)
    field1 = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

2. **Create Corresponding Schema** (`backend/schemas.py`)
```python
class MyModelSchema(BaseModel):
    id: int
    field1: str
    created_at: datetime
    
    class Config:
        from_attributes = True
```

3. **Database migration** (automatically handled by SQLAlchemy on init_db)

## Testing

### Running Backend Tests (if tests exist)
```bash
# Activate virtual environment
.venv\Scripts\activate

# Run pytest
pytest tests/
```

### Manual API Testing

Use the built-in Swagger UI:
1. Navigate to http://localhost:8765/docs
2. Authenticate (if required)
3. Try out endpoints directly in the browser

### Frontend Testing
```bash
cd frontend
npm run test  # if tests are configured
```

## Debugging

### Backend Debugging

**Using Print Statements:**
```python
from rich import print as rprint

rprint(f"[bold red]Debug Info: {variable}[/]")
```

**Using Logging:**
```python
import logging
logger = logging.getLogger(__name__)
logger.debug(f"Debug message: {value}")
```

**Using Breakpoints with IDE:**
- Set breakpoint in VSCode
- Debug via Python extension

### Frontend Debugging

**Browser DevTools:**
1. Open Developer Tools (F12)
2. Console tab for messages
3. Network tab for API calls
4. Application tab for local storage/cookies

**VSCode Debugger:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "Attach Chrome",
      "port": 9222,
      "pathMapping": {
        "/": "${workspaceRoot}/frontend/src"
      }
    }
  ]
}
```

## Performance Optimization Tips

### Backend
- Use `async/await` for I/O operations
- Implement caching for repeated queries
- Profile with `cProfile` for bottlenecks
- Use connection pooling for database

### Frontend
- Code-split React components with `React.lazy()`
- Memoize expensive computations with `useMemo`
- Use `React.memo` for component optimization
- Monitor bundle size with vite

## Common Issues and Solutions

### Virtual Environment Not Activating
```bash
# Windows PowerShell issue - run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
.venv\Scripts\Activate.ps1
```

### CORS Errors
- Check backend CORS configuration in `backend/main.py`
- Ensure frontend URL matches allowed origins in `.env`

### JWT Token Expired
- Tokens expire after JWT_EXPIRATION_HOURS
- User needs to login again
- Refresh token logic can be added if needed

### API Key Errors
- Verify `.env` file exists in project root
- Check API keys are correct and valid
- Ensure no extra quotes or whitespace in `.env`

### Database Locked
```bash
# Remove SQLite database and reinitialize
rm data/research.db
# Restart backend
```

## Git Workflow

### Before Committing
```bash
# Check status
git status

# Stage changes
git add .

# Commit with clear message
git commit -m "feat: add new feature description"
```

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code improvements

### Pull Request Checklist
- [ ] Code follows project conventions
- [ ] No console errors or warnings
- [ ] Tests pass (if applicable)
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] No sensitive data committed

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [LangChain Documentation](https://python.langchain.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Getting Help

1. Check [Architecture Documentation](./ARCHITECTURE.md)
2. Review similar existing code
3. Check FastAPI/React/LangChain official docs
4. Open an issue on GitHub with details
5. Contact the development team

---

Happy coding! 🚀
