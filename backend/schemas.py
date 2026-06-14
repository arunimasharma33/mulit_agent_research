from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AuthResponse(BaseModel):
    token: str
    user: UserResponse


class ResearchRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=500)


class HistorySummary(BaseModel):
    id: int
    topic: str
    created_at: datetime

    model_config = {"from_attributes": True}


class HistoryDetail(BaseModel):
    id: int
    topic: str
    search_results: str | None
    scraped_content: str | None
    report: str | None
    feedback: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
