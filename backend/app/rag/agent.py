from langchain_openai import ChatOpenAI
from langchain.chains.summarize import load_summarize_chain
from langchain_community.document_loaders import PyPDFLoader
import os

class AIAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.2)

    async def summarize_document(self, file_path: str):
        if not os.path.exists(file_path):
            return "File not found"
        
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        
        chain = load_summarize_chain(self.llm, chain_type="map_reduce")
        summary = chain.invoke(docs)
        
        return summary["output_text"]

ai_agent = AIAgent()
