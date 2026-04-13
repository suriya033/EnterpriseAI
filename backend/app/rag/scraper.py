import requests
from bs4 import BeautifulSoup
from langchain.docstore.document import Document
from app.rag.engine import rag_engine
import os

class WebScraper:
    def scrape_url(self, url: str):
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
                
            text = soup.get_text(separator='\n')
            
            # Clean up whitespace
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = '\n'.join(chunk for chunk in chunks if chunk)
            
            # Create a document and pass it to rag_engine
            # Need a temporary path or modify rag_engine to accept text/docs
            # For simplicity, I'll save it as a txt file and process it
            
            domain = url.split("//")[-1].split("/")[0].replace(".", "_")
            UPLOAD_DIR = "documents"
            if not os.path.exists(UPLOAD_DIR):
                os.makedirs(UPLOAD_DIR)
                
            file_path = f"{UPLOAD_DIR}/{domain}.txt"
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(text)
            
            rag_engine.process_file(file_path)
            return True, file_path
        except Exception as e:
            return False, str(e)

web_scraper = WebScraper()
