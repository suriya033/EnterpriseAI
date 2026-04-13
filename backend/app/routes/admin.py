from fastapi import APIRouter, Depends
from app.core.db import get_db
import os

router = APIRouter()

@router.get("/stats")
async def get_stats():
    # In a real app, query MongoDB
    UPLOAD_DIR = "documents"
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
        
    docs_count = len(os.listdir(UPLOAD_DIR))
    return {
        "users": 1, # Placeholder
        "documents": docs_count,
        "queries": 42, # Placeholder
        "storage_used": "12MB"
    }

@router.get("/users")
async def list_users():
    return [{"id": 1, "username": "admin", "role": "admin"}]
