from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from services.feed_service import FeedService
from services.gemini_service import GeminiService

load_dotenv()

app = FastAPI(title="World News Summarizer")

feed_service = FeedService()
try:
    gemini_service = GeminiService()
except ValueError as e:
    print(f"Warning: {e}")
    gemini_service = None

class SummarizeRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the World News Summarizer API"}

@app.get("/api/news")
def get_news():
    return feed_service.fetch_all()

@app.post("/api/summarize")
def summarize_article(request: SummarizeRequest):
    if not gemini_service:
        raise HTTPException(status_code=500, detail="Gemini Service not configured")
    return {"summary": gemini_service.summarize(request.text)}
