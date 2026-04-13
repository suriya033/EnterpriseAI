import os
from langchain_community.document_loaders import PyPDFLoader, TextLoader, UnstructuredWordDocumentLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import MongoDBAtlasVectorSearch
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from app.core.db import db
from dotenv import load_dotenv

load_dotenv()

class RAGEngine:
    def __init__(self):
        # On Vercel, we MUST use an API for embeddings (OpenAI)
        # Note: Ensure OPENAI_API_KEY has quota or switch to another provider
        self.embeddings = OpenAIEmbeddings()
        self.vector_search_collection = db["vector_search"]
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.vector_store = MongoDBAtlasVectorSearch(
            collection=self.vector_search_collection,
            embedding=self.embeddings,
            index_name="default"
        )
        self.llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

    def process_file(self, file_path: str):
        if file_path.endswith('.pdf'):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith('.docx'):
            loader = UnstructuredWordDocumentLoader(file_path)
        else:
            loader = TextLoader(file_path, encoding='utf-8')
        
        documents = loader.load()
        chunks = self.text_splitter.split_documents(documents)
        
        self.vector_store.add_documents(chunks)
        return len(chunks)

    def query(self, question: str):
        # API based retrieval
        prompt_template = """Use the following pieces of context to answer the question at the end. 
        If you don't know the answer, just say that you don't know, don't try to make up an answer.
        Answer only based on the document's content.

        {context}

        Question: {question}
        Answer:"""
        
        PROMPT = PromptTemplate(
            template=prompt_template, input_variables=["context", "question"]
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever(search_kwargs={"k": 3}),
            return_source_documents=True,
            chain_type_kwargs={"prompt": PROMPT}
        )
        
        result = qa_chain.invoke({"query": question})
        
        sources = [doc.metadata.get("source", "Unknown") for doc in result["source_documents"]]
        return result["result"], list(set(sources))

rag_engine = RAGEngine()
