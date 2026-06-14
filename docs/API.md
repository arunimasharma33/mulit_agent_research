# API Reference

Complete API documentation for the Multi-Agent Research System backend.

**Base URL**: `http://localhost:8765`

## Table of Contents

1. [Authentication](#authentication)
2. [Research](#research)
3. [History](#history)
4. [Response Formats](#response-formats)
5. [Error Handling](#error-handling)

---

## Authentication

### Register New User

Creates a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "email": "user@example.com",
  "message": "User registered successfully"
}
```

**Error Responses**:
- `400 Bad Request` - Invalid email format or password too weak
- `409 Conflict` - Email already registered

**Example cURL**:
```bash
curl -X POST http://localhost:8765/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

---

### Login

Authenticates user and returns JWT token.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Responses**:
- `401 Unauthorized` - Invalid credentials
- `404 Not Found` - User not found

**Example cURL**:
```bash
curl -X POST http://localhost:8765/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

**Using the Token**:
All subsequent requests must include the token in the Authorization header:
```bash
Authorization: Bearer {access_token}
```

---

### Get Current User

Retrieves information about the authenticated user.

**Endpoint**: `GET /api/auth/me`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2024-06-14T10:30:00"
}
```

**Error Responses**:
- `401 Unauthorized` - Invalid or missing token

---

## Research

### Start Research Pipeline

Initiates a new research task with the multi-agent pipeline.

**Endpoint**: `POST /api/research/start`

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "topic": "Latest advances in quantum computing"
}
```

**Response** (200 OK - Server-Sent Events Stream):

The response streams events as each agent completes its work. Connect to receive Server-Sent Events:

```
data: {"step":"search","status":"started","label":"Search Agent"}
data: {"step":"search","status":"completed","label":"Search Agent","content":"Found 5 relevant sources..."}
data: {"step":"read","status":"started","label":"Reader Agent"}
data: {"step":"read","status":"completed","label":"Reader Agent","content":"Extracted content from sources..."}
data: {"step":"write","status":"started","label":"Writer Agent"}
data: {"step":"write","status":"completed","label":"Writer Agent","content":"Generated research report..."}
data: {"step":"critique","status":"started","label":"Critic Agent"}
data: {"step":"critique","status":"completed","label":"Critic Agent","content":"Final polished report..."}
data: {"final":true,"research_id":123}
```

**Event Object Structure**:
```typescript
{
  step: "search" | "read" | "write" | "critique",
  status: "started" | "completed" | "error",
  label: string,
  content?: string,
  error?: string,
  final?: boolean,
  research_id?: number
}
```

**Error Responses**:
- `401 Unauthorized` - Invalid token
- `400 Bad Request` - Invalid topic
- `500 Internal Server Error` - Pipeline execution error

**Example with JavaScript Fetch**:
```javascript
const token = localStorage.getItem('token');

const eventSource = new EventSource(
  'http://localhost:8765/api/research/start',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      topic: 'Latest advances in quantum computing'
    })
  }
);

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('Progress:', data);
  
  if (data.final) {
    console.log('Research complete! ID:', data.research_id);
    eventSource.close();
  }
});

eventSource.addEventListener('error', (error) => {
  console.error('Error:', error);
  eventSource.close();
});
```

**Example with cURL**:
```bash
curl -N -X POST http://localhost:8765/api/research/start \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"topic":"Quantum Computing Advances"}'
```

---

## History

### Get Research History Summary

Retrieves list of user's research projects.

**Endpoint**: `GET /api/history`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Query Parameters**:
- `skip`: Number of records to skip (default: 0)
- `limit`: Maximum records to return (default: 10)

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "topic": "Latest advances in quantum computing",
    "created_at": "2024-06-14T10:30:00",
    "updated_at": "2024-06-14T10:45:00"
  },
  {
    "id": 2,
    "topic": "AI Ethics",
    "created_at": "2024-06-13T15:20:00",
    "updated_at": "2024-06-13T15:35:00"
  }
]
```

**Error Responses**:
- `401 Unauthorized` - Invalid token

**Example cURL**:
```bash
curl -X GET "http://localhost:8765/api/history?skip=0&limit=10" \
  -H "Authorization: Bearer {token}"
```

---

### Get Research Details

Retrieves complete details of a specific research project.

**Endpoint**: `GET /api/history/{research_id}`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Path Parameters**:
- `research_id` (integer, required) - ID of the research project

**Response** (200 OK):
```json
{
  "id": 1,
  "topic": "Latest advances in quantum computing",
  "search_results": "Found sources about quantum entanglement, quantum gates...",
  "content": "Extracted content from 5 sources covering quantum computing breakthroughs",
  "report": "Detailed research report synthesizing all gathered information...",
  "critique": "Final polished report with enhanced clarity and structure...",
  "created_at": "2024-06-14T10:30:00",
  "updated_at": "2024-06-14T10:45:00"
}
```

**Error Responses**:
- `401 Unauthorized` - Invalid token
- `404 Not Found` - Research not found or unauthorized access

**Example cURL**:
```bash
curl -X GET "http://localhost:8765/api/history/1" \
  -H "Authorization: Bearer {token}"
```

---

### Delete Research

Deletes a research project from history.

**Endpoint**: `DELETE /api/history/{research_id}`

**Headers**:
```
Authorization: Bearer {access_token}
```

**Path Parameters**:
- `research_id` (integer, required) - ID of the research project

**Response** (200 OK):
```json
{
  "message": "Research deleted successfully"
}
```

**Error Responses**:
- `401 Unauthorized` - Invalid token
- `404 Not Found` - Research not found
- `403 Forbidden` - Cannot delete other user's research

**Example cURL**:
```bash
curl -X DELETE "http://localhost:8765/api/history/1" \
  -H "Authorization: Bearer {token}"
```

---

## Response Formats

### Success Response Format

```json
{
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-06-14T10:30:00"
}
```

### Error Response Format

```json
{
  "detail": "Error description",
  "status": 400,
  "timestamp": "2024-06-14T10:30:00"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Common Cause |
|------|---------|--------------|
| 200 | OK | Successful request |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Invalid input or malformed request |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (duplicate) |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | External service (API) unavailable |

### Error Response Examples

**Invalid Credentials**:
```json
{
  "detail": "Incorrect email or password",
  "status": 401
}
```

**Missing Token**:
```json
{
  "detail": "Not authenticated",
  "status": 401
}
```

**Invalid Email Format**:
```json
{
  "detail": "Invalid email format",
  "status": 400
}
```

**Duplicate Email**:
```json
{
  "detail": "Email already registered",
  "status": 409
}
```

---

## Rate Limiting

Currently, no rate limiting is enforced. However, keep in mind:
- **Tavily Search API**: Rate limits apply per account
- **LLM APIs**: Rate limits and costs apply per token
- **Database**: Queries have implicit limits

---

## Authentication Security

### Token Management

1. **Token Storage** (Frontend):
   - Store JWT in memory or sessionStorage (not localStorage for sensitive apps)
   - Include in Authorization header for all requests

2. **Token Expiration**:
   - Tokens expire after `JWT_EXPIRATION_HOURS` (default: 24)
   - Expired tokens return `401 Unauthorized`
   - User must re-authenticate

3. **Token Refresh**:
   - Currently requires re-login
   - Refresh token mechanism can be implemented if needed

### Security Best Practices

- Always use HTTPS in production
- Never expose tokens in URLs
- Include token only in Authorization header
- Implement token refresh mechanism for long sessions
- Clear tokens on logout
- Use secure, random JWT_SECRET_KEY

---

## API Documentation Tools

Access interactive API documentation:

- **Swagger UI**: http://localhost:8765/docs
- **ReDoc**: http://localhost:8765/redoc
- **OpenAPI Schema**: http://localhost:8765/openapi.json

---

## Examples

### Complete Research Workflow (JavaScript)

```javascript
// 1. Register
const registerResponse = await fetch('http://localhost:8765/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepass123'
  })
});

// 2. Login
const loginResponse = await fetch('http://localhost:8765/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepass123'
  })
});

const { access_token } = await loginResponse.json();

// 3. Start Research
const eventSource = new EventSource('http://localhost:8765/api/research/start', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ topic: 'Machine Learning Trends' })
});

// 4. Monitor Progress
eventSource.addEventListener('message', event => {
  console.log(JSON.parse(event.data));
});

// 5. Get History
const historyResponse = await fetch('http://localhost:8765/api/history', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});

const history = await historyResponse.json();
```

---

For more information, see [README.md](../README.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).
