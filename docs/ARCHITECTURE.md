# Architecture Documentation

## System Overview

The Multi-Agent Research System is built on a client-server architecture with a sophisticated agent orchestration pipeline.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)            │
│  Components: AuthForm, TopicForm, PipelineProgress, etc.   │
│                    Hosted on Port 5173                       │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/WebSocket
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                 Backend API (FastAPI + Uvicorn)             │
│  Endpoints: /auth, /research, /history                      │
│                    Hosted on Port 8765                       │
└──┬─────────────────────────────────────────────────────────┬┘
   │                                                          │
   ↓                                                          ↓
┌──────────────────────┐                        ┌───────────────────┐
│  Agent Pipeline      │                        │  Database         │
│  - Search Agent      │                        │  - Users          │
│  - Reader Agent      │                        │  - Research Hist. │
│  - Writer Agent      │                        │  - Sessions       │
│  - Critic Agent      │                        │                   │
└──────────────────────┘                        └───────────────────┘
   │
   ├─→ LangChain Framework
   ├─→ LLM Integration (OpenAI, Mistral)
   ├─→ External Tools
   │   ├─→ Tavily Search API
   │   ├─→ BeautifulSoup (Web Scraping)
   │   └─→ Requests Library
```

## Backend Architecture

### Directory Structure

```
backend/
├── main.py          # FastAPI application setup and route handlers
├── auth.py          # JWT token generation, password hashing
├── database.py      # SQLAlchemy setup, session management
├── models.py        # ORM models (User, ResearchHistory, etc.)
└── schemas.py       # Pydantic request/response validation models
```

### Key Components

#### 1. FastAPI Application (`main.py`)
- Sets up FastAPI app with CORS middleware
- Defines all HTTP routes
- Manages startup/shutdown events
- Handles streaming responses for real-time pipeline updates

**Key Routes:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/research/start` - Initiate research pipeline
- `GET /api/history` - Retrieve user's research history
- `GET /api/history/{id}` - Get specific research details

#### 2. Authentication Module (`auth.py`)
- JWT token creation and validation
- Password hashing using bcrypt
- User verification and authorization
- Token dependency injection for protected routes

**Functions:**
- `create_access_token(data)` - Generate JWT tokens
- `verify_password(plain, hashed)` - Verify password
- `get_current_user(token)` - Extract user from token
- `hash_password(password)` - Hash passwords securely

#### 3. Database Module (`database.py`)
- SQLAlchemy configuration
- Session factory setup
- Database initialization
- Dependency injection for database sessions

**Functions:**
- `init_db()` - Create database tables
- `get_db()` - Get database session

#### 4. Data Models (`models.py`)
- SQLAlchemy ORM models
- Database table definitions

**Models:**
- `User` - User accounts with email and hashed password
- `ResearchHistory` - Stored research projects and results

#### 5. Schemas (`schemas.py`)
- Pydantic models for request/response validation
- Data type validation and serialization

**Key Schemas:**
- `RegisterRequest`, `LoginRequest` - Auth requests
- `ResearchRequest` - Research topic input
- `HistorySummary`, `HistoryDetail` - History responses

## Frontend Architecture

### Directory Structure

```
frontend/src/
├── App.tsx              # Main application component
├── main.tsx             # React entry point
├── index.css            # Global styles
├── api/                 # API client functions
│   ├── auth.ts          # Authentication API calls
│   ├── research.ts      # Research pipeline API calls
│   └── history.ts       # History retrieval API calls
├── components/          # Reusable React components
│   ├── AuthForm.tsx     # Login/Register form
│   ├── TopicForm.tsx    # Research topic input
│   ├── ContentPanel.tsx  # Research results display
│   ├── PipelineProgress.tsx - Pipeline status visualization
│   ├── HistoryPanel.tsx  # Research history view
│   ├── Header.tsx       # Navigation header
│   └── LogoIcon.tsx     # Logo component
└── context/             # React Context for state management
    └── AuthContext.tsx  # Authentication state
```

### Component Hierarchy

```
App
├── Header
│   ├── Logo
│   └── User Info
├── AuthForm (when not logged in)
└── MainDashboard (when logged in)
    ├── TopicForm
    ├── PipelineProgress
    │   ├── SearchAgentProgress
    │   ├── ReaderAgentProgress
    │   ├── WriterAgentProgress
    │   └── CriticAgentProgress
    ├── ContentPanel
    └── HistoryPanel
```

## Agent Pipeline Architecture

### Pipeline Execution Flow

```
Input: User Research Topic
    ↓
[1] SEARCH AGENT (agents.py::build_search_agent)
    - Tool: web_search (Tavily Search API)
    - Output: Relevant URLs and summaries
    ↓
    Progress: {"step": "search", "status": "completed"}
    ↓
[2] READER AGENT (agents.py::build_reader_agent)
    - Tool: scrape_url (BeautifulSoup)
    - Input: URLs from search agent
    - Output: Extracted content from pages
    ↓
    Progress: {"step": "read", "status": "completed"}
    ↓
[3] WRITER AGENT (agents.py::writer_chain)
    - Model: LLM (OpenAI or Mistral)
    - Input: Scraped content + topic
    - Output: Structured research report
    ↓
    Progress: {"step": "write", "status": "completed"}
    ↓
[4] CRITIC AGENT (agents.py::critic_chain)
    - Model: LLM (same as writer)
    - Input: Generated report
    - Output: Reviewed and improved report
    ↓
    Progress: {"step": "critique", "status": "completed"}
    ↓
Output: Final Research Report
```

### Key Pipeline Functions (`pipeline.py`)

```python
def run_research_pipeline(
    topic: str,
    on_progress: ProgressCallback | None = None
) -> dict
```

- Orchestrates all agents in sequence
- Emits progress events via callback
- Maintains state across agent invocations
- Returns final combined results

### Agent Definitions (`agents.py`)

**Search Agent:**
- Uses Mistral LLM (medium-2505)
- Equipped with web_search tool
- Temperature: 0.3 (deterministic)

**Reader Agent:**
- Same LLM as Search Agent
- Equipped with scrape_url tool
- Extracts meaningful content

**Writer Chain:**
- Prompt-based (ChatPromptTemplate)
- System prompt: "You are an expert research writer..."
- Outputs formatted research report

**Critic Chain:**
- Prompt-based chain
- Reviews report quality
- Suggests improvements

## Database Schema

### User Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ResearchHistory Table
```sql
CREATE TABLE research_history (
    id INTEGER PRIMARY KEY,
    user_id INTEGER FOREIGN KEY,
    topic VARCHAR NOT NULL,
    search_results TEXT,
    content TEXT,
    report TEXT,
    critique TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);
```

## Security Architecture

### Authentication Flow

```
1. User Registration
   Email + Password → Backend
   ↓
   Validate Email Format
   ↓
   Hash Password (bcrypt)
   ↓
   Store User in Database
   ↓
   Return Success

2. User Login
   Email + Password → Backend
   ↓
   Lookup User by Email
   ↓
   Verify Password Hash
   ↓
   Generate JWT Token
   ↓
   Return Token + User Info

3. Authenticated Request
   Headers: Authorization: Bearer {JWT}
   ↓
   Backend Validates JWT
   ↓
   Extract User ID from Token
   ↓
   Process Request
```

### JWT Token Structure
- Algorithm: HS256
- Expiration: 24 hours (configurable)
- Payload: `{"user_id": X, "email": "user@example.com", "exp": timestamp}`

## Data Flow Examples

### Research Initiation Flow

```
User Input: "Latest advances in quantum computing"
    ↓
Frontend: POST /api/research/start
    ↓
Backend: 
    - Validate user authentication
    - Create research record in DB
    - Initialize pipeline
    ↓
Pipeline Execution:
    - Search Agent finds sources
    - Reader Agent extracts content
    - Writer Agent creates report
    - Critic Agent improves report
    ↓
Streaming Response:
    - Progress events sent via Server-Sent Events
    - Frontend updates UI in real-time
    ↓
Final Result:
    - Complete report saved to database
    - Returned to frontend
    - User sees finished report
```

### Authentication Flow

```
User: Register with email and password
    ↓
Frontend: POST /api/auth/register
    ↓
Backend:
    - Validate email format
    - Hash password with bcrypt
    - Create user record
    ↓
Response: Success message
    ↓
User: Login with email and password
    ↓
Frontend: POST /api/auth/login
    ↓
Backend:
    - Lookup user by email
    - Verify password hash
    - Create JWT token
    ↓
Response: JWT token + user info
    ↓
Frontend: Store token in memory/localStorage
    ↓
User: Subsequent requests include Authorization header
```

## Performance Considerations

### Optimization Strategies

1. **Streaming Responses**: Real-time pipeline updates without waiting for completion
2. **Async/Await**: LangChain agent operations are async
3. **Token Counting**: Monitor LLM token usage with tiktoken
4. **Retry Logic**: Tenacity library handles temporary API failures
5. **Connection Pooling**: Requests library manages HTTP connections

### Scalability

- **Stateless Backend**: Each request is independent
- **Database Indexing**: User ID indexed on research_history
- **API Rate Limiting**: Respect Tavily Search and LLM rate limits
- **Horizontal Scaling**: Multiple backend instances possible with shared database

## Deployment Considerations

### Development vs Production

**Development:**
- DEBUG=True
- CORS allows localhost
- SQLite database
- Direct API access

**Production:**
- DEBUG=False
- CORS restricted to domain
- PostgreSQL database
- SSL/TLS encryption
- Environment-based secrets
- Proper logging and monitoring

### Required Services

1. LLM Provider (OpenAI or Mistral)
2. Search Provider (Tavily Search)
3. Database (SQLite for dev, PostgreSQL for prod)
4. Web Hosting (Backend and Frontend)

## Monitoring and Debugging

### Logging Points

- Authentication events
- Research pipeline milestones
- API errors and exceptions
- Database operations
- External API calls

### Debug Tools

- FastAPI Swagger UI: http://localhost:8765/docs
- FastAPI ReDoc: http://localhost:8765/redoc
- Backend logs via Rich library
- Frontend browser console
- Network tab in browser DevTools

---

For more information, see [README.md](../README.md) or specific module documentation.
