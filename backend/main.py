import json
import queue
import threading
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.auth import (
    create_access_token,
    get_current_user,
    get_optional_user,
    hash_password,
    verify_password,
)
from backend.database import SessionLocal, get_db, init_db
from backend.models import ResearchHistory, User
from backend.schemas import (
    AuthResponse,
    HistoryDetail,
    HistorySummary,
    LoginRequest,
    RegisterRequest,
    ResearchRequest,
    UserResponse,
)
from pipeline import run_research_pipeline


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Multi-Agent Research API",
    description="Search, read, write, and critique research reports via coordinated AI agents.",
    version="1.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app|http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/auth/register", response_model=AuthResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.scalar(select(User).where(User.email == request.email.lower()))
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")

    user = User(
        email=request.email.lower(),
        name=request.name.strip(),
        password_hash=hash_password(request.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, user.email)
    return AuthResponse(token=token, user=UserResponse.model_validate(user))


@app.post("/api/auth/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == request.email.lower()))
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(user.id, user.email)
    return AuthResponse(token=token, user=UserResponse.model_validate(user))


@app.get("/api/auth/me", response_model=UserResponse)
def me(user: User = Depends(get_current_user)):
    return UserResponse.model_validate(user)


@app.get("/api/history", response_model=list[HistorySummary])
def list_history(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.scalars(
        select(ResearchHistory)
        .where(ResearchHistory.user_id == user.id)
        .order_by(ResearchHistory.created_at.desc())
    ).all()
    return [HistorySummary.model_validate(row) for row in rows]


@app.get("/api/history/{history_id}", response_model=HistoryDetail)
def get_history(
    history_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    row = db.get(ResearchHistory, history_id)
    if not row or row.user_id != user.id:
        raise HTTPException(status_code=404, detail="Search not found.")
    return HistoryDetail.model_validate(row)


@app.post("/api/research/stream")
def research_stream(
    request: ResearchRequest,
    user: User | None = Depends(get_optional_user),
):
    topic = request.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic is required.")

    event_queue: queue.Queue = queue.Queue()
    sentinel = object()

    def worker() -> None:
        session = SessionLocal()
        try:
            def on_progress(event: dict) -> None:
                event_queue.put(event)

            state = run_research_pipeline(topic, on_progress=on_progress)

            if user is not None:
                history = ResearchHistory(
                    user_id=user.id,
                    topic=topic,
                    search_results=state.get("search_results"),
                    scraped_content=state.get("scraped_content"),
                    report=state.get("report"),
                    feedback=state.get("feedback"),
                )
                session.add(history)
                session.commit()
                session.refresh(history)
                event_queue.put({
                    "step": "saved",
                    "status": "completed",
                    "history_id": history.id,
                })
        except Exception as exc:
            session.rollback()
            event_queue.put({"step": "error", "status": "failed", "message": str(exc)})
        finally:
            session.close()
            event_queue.put(sentinel)

    threading.Thread(target=worker, daemon=True).start()

    def generate():
        while True:
            item = event_queue.get()
            if item is sentinel:
                break
            yield f"data: {json.dumps(item)}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
