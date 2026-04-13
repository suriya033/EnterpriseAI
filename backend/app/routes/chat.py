from fastapi import APIRouter, HTTPException
from app.rag.engine import rag_engine
from pydantic import BaseModel

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: list = []

@router.post("/query")
async def chat_query(request: ChatRequest):
    try:
        answer, sources = rag_engine.query(request.message)
        return {
            "answer": answer,
            "sources": sources,
            "confidence": 0.95 # Placeholder for now
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from app.rag.agent import ai_agent

@router.post("/summarize")
async def summarize_doc(payload: dict):
    filename = payload.get("filename")
    if not filename:
        raise HTTPException(status_code=400, detail="Filename is required")
    
    file_path = f"documents/{filename}"
    summary = await ai_agent.summarize_document(file_path)
    return {"summary": summary}
