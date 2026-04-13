from fastapi import APIRouter, UploadFile, File, HTTPException
from app.rag.engine import rag_engine
from app.rag.scraper import web_scraper
import os
import shutil

router = APIRouter()

UPLOAD_DIR = "documents"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        num_chunks = rag_engine.process_file(file_path)
        return {"filename": file.filename, "status": "processed", "chunks": num_chunks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/scrape")
async def scrape_website(payload: dict):
    url = payload.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="URL is required")
    
    success, result = web_scraper.scrape_url(url)
    if success:
        return {"status": "success", "file": result}
    else:
        raise HTTPException(status_code=500, detail=result)

@router.get("/list")
async def list_documents():
    files = os.listdir(UPLOAD_DIR)
    return {"documents": files}
