# Multi-Agent Research System

https://mulit-agent-research-g82n.vercel.app/

A sophisticated AI-powered research platform that leverages coordinated multi-agent systems to conduct comprehensive research, generate detailed reports, and provide critical analysis—all through an intuitive web interface.

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![Python Version](https://img.shields.io/badge/python-3.9%2B-blue)
![Node Version](https://img.shields.io/badge/node-18%2B-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Overview

The Multi-Agent Research System combines multiple specialized AI agents to produce high-quality research reports. Each agent plays a distinct role in a coordinated pipeline:

- **Search Agent**: Discovers relevant, recent, and reliable information across the web
- **Reader Agent**: Extracts and processes content from identified sources
- **Writer Agent**: Synthesizes information into clear, structured research reports
- **Critic Agent**: Reviews and enhances report quality

## ✨ Features

- **Multi-Agent Orchestration**: Coordinated AI agents working together for comprehensive research
- **Real-time Progress Tracking**: Monitor each stage of the research pipeline
- **User Authentication**: Secure authentication with JWT tokens
- **Research History**: Store and retrieve past research projects
- **Web Search Integration**: Access to Tavily Search for up-to-date information
- **Content Scraping**: Extract and process content from web sources
- **LLM Flexibility**: Support for OpenAI and Mistral AI models
- **Responsive UI**: Modern React-based interface with Vite
- **RESTful API**: Well-documented FastAPI backend

## 📊 Demo

### Main Dashboard
![Main Dashboard](docs/images/dashboard-demo.png)
*The primary interface showing the research topic input form and pipeline progress visualization.*

### Research Results
![Research Results](docs/images/research-results-demo.png)
*Display of generated research report with structured sections from the writer agent.*

### Research History
![Research History](docs/images/history-view-demo.png)
*User's previous research projects with quick access and detailed review options.*

## 🏗️ Project Structure

```
project_multiagent/
├── backend/                    # FastAPI backend application
│   ├── main.py                # FastAPI app entry point & routes
│   ├── auth.py                # Authentication & JWT token handling
│   ├── database.py            # Database initialization & session management
│   ├── models.py              # SQLAlchemy ORM models
│   └── schemas.py             # Pydantic request/response schemas
├── frontend/                  # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx            # Main application component
│   │   ├── main.tsx           # React entry point
│   │   ├── api/               # API client functions
│   │   │   ├── auth.ts
│   │   │   ├── history.ts
│   │   │   └── research.ts
│   │   ├── components/        # Reusable UI components
│   │   │   ├── AuthForm.tsx
│   │   │   ├── ContentPanel.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── HistoryPanel.tsx
│   │   │   ├── PipelineProgress.tsx
│   │   │   └── TopicForm.tsx
│   │   └── context/           # React Context for state management
│   │       └── AuthContext.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── agents.py                  # AI agent definitions & builders
├── pipeline.py                # Research pipeline orchestration
├── tools.py                   # Specialized tools (search, scrape)
├── data/                      # Data storage directory
├── req.txt                    # Python dependencies
├── package.json               # Root npm scripts
├── start.bat                  # Full-stack startup script
├── start-backend.bat          # Backend-only startup script
├── .env                       # Environment configuration (create from .env.example)
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+**
- **Node.js 18+** & npm
- **OpenAI API Key** (or Mistral AI)
- **Tavily Search API Key** (for web search)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project_multiagent
   ```

2. **Create Python virtual environment**
   ```bash
   python -m venv .venv
   
   # Windows
   .venv\Scripts\activate
   
   # macOS/Linux
   source .venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r req.txt
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

5. **Configure environment variables**
   ```bash
   # Create .env file in project root
   cp .env.example .env
   ```
   
   Then edit `.env` with your API keys:
   ```env
   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Mistral AI Configuration
   MISTRAL_API_KEY=your_mistral_api_key_here
   
   # Tavily Search
   TAVILY_API_KEY=your_tavily_api_key_here
   
   # Database
   DATABASE_URL=sqlite:///./data/research.db
   
   # JWT
   JWT_SECRET_KEY=your_secret_key_here
   JWT_ALGORITHM=HS256
   ```

### Running the Application

#### Option 1: Full Stack (Recommended)
```bash
# Windows
start.bat

# macOS/Linux
./start.sh
```

#### Option 2: Backend Only
```bash
# Windows
start-backend.bat

# macOS/Linux - Manual
.venv/bin/python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8765
```

#### Option 3: Frontend Only
```bash
cd frontend
npm run dev
```

The application will be available at:
[https://mulit-agent-research-g82n.vercel.app/]

## 📚 API Documentation

### Authentication Endpoints

#### Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

# Response
{
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "user": {...}
}
```

### Research Endpoints

#### Start Research
```bash
POST /api/research/start
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "topic": "Quantum Computing Latest Advances"
}

# Streaming Response
Server-Sent Events with progress updates
```

#### Get Research History
```bash
GET /api/history
Authorization: Bearer {access_token}
```

#### Get Research Details
```bash
GET /api/history/{research_id}
Authorization: Bearer {access_token}
```

For complete API documentation, visit http://localhost:8765/docs when running the backend.

## 🤖 Agent Pipeline Architecture

```
┌─────────────────────────────────────────────────────┐
│          Research Pipeline Orchestration           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  User Input (Topic)                                │
│          ↓                                          │
│  [Search Agent]  → Find relevant sources           │
│          ↓                                          │
│  [Reader Agent]  → Extract & process content       │
│          ↓                                          │
│  [Writer Agent]  → Generate structured report      │
│          ↓                                          │
│  [Critic Agent]  → Review & enhance quality        │
│          ↓                                          │
│  Output: Polished Research Report                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 💻 Technology Stack

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: SQLAlchemy + SQLite
- **Authentication**: JWT + bcrypt
- **AI/LLM**: LangChain, OpenAI, Mistral AI
- **Search**: Tavily Search API
- **Web Scraping**: Beautiful Soup 4
- **Async Support**: aiohttp

### Frontend
- **Library**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS
- **HTTP Client**: Axios (via custom API functions)

### DevOps & Tools
- **Environment Management**: python-dotenv
- **Validation**: Pydantic, email-validator
- **Data Processing**: pandas
- **Token Counting**: tiktoken
- **Logging**: rich
- **Retry Logic**: tenacity

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# LLM Configuration
OPENAI_API_KEY=sk-...
MISTRAL_API_KEY=...

# Search
TAVILY_API_KEY=...

# Database
DATABASE_URL=sqlite:///./data/research.db

# Security
JWT_SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# Server
BACKEND_HOST=127.0.0.1
BACKEND_PORT=8765
```

## 📖 Usage Example

### Through the Web UI

1. **Register/Login**: Create an account or sign in
2. **Enter Research Topic**: Type your research topic in the input field
3. **Monitor Progress**: Watch real-time updates as agents process your request
4. **Review Report**: Read the generated research report
5. **Save to History**: Reports are automatically saved for future reference

### Through API (cURL)

```bash
# 1. Register
curl -X POST http://localhost:8765/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# 2. Login
curl -X POST http://localhost:8765/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# 3. Start Research (replace TOKEN with actual JWT)
curl -X POST http://localhost:8765/api/research/start \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic":"Artificial Intelligence in Healthcare"}'
```

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python virtual environment is activated
- Check all dependencies: `pip install -r req.txt`
- Verify `.env` file exists and has required API keys

### Frontend won't connect to backend
- Ensure backend is running on port 8765
- Check CORS configuration in `backend/main.py`
- Verify firewall isn't blocking localhost connections

### Research fails with API errors
- Verify API keys in `.env` are valid
- Check Tavily Search API availability
- Review backend logs for detailed error messages

### Database issues
- Delete `data/research.db` to reset database
- Ensure `data/` directory has write permissions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- LangChain for the AI framework
- OpenAI and Mistral AI for LLM capabilities
- Tavily Search for web search integration
- FastAPI and React communities

## 📞 Support

For issues, questions, or suggestions:
- Open an [issue](../../issues) on GitHub
- Review [documentation](./docs)
- Check [troubleshooting](#-troubleshooting) section

---

**Built with ❤️ by me**
