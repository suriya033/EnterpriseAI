import os
from langchain_community.document_loaders import PyPDFLoader, TextLoader, UnstructuredWordDocumentLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

class RAGEngine:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.vector_db_path = "vector_db/faiss_index"
        self.llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0) # Can be swapped for Llama 3 via Groq/Ollama

    def process_file(self, file_path: str):
        if file_path.endswith('.pdf'):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith('.docx'):
            loader = UnstructuredWordDocumentLoader(file_path)
        else:
            loader = TextLoader(file_path, encoding='utf-8')
        
        documents = loader.load()
        chunks = self.text_splitter.split_documents(documents)
        
        index_file = os.path.join(self.vector_db_path, "index.faiss")
        
        if os.path.exists(index_file):
            vector_store = FAISS.load_local(self.vector_db_path, self.embeddings)
            vector_store.add_documents(chunks)
        else:
            vector_store = FAISS.from_documents(chunks, self.embeddings)
        
        # Ensure parent directory exists
        os.makedirs(os.path.dirname(self.vector_db_path), exist_ok=True)
        vector_store.save_local(self.vector_db_path)
        return len(chunks)

    def query(self, question: str):
        index_file = os.path.join(self.vector_db_path, "index.faiss")
        if not os.path.exists(index_file):
            return "No documents uploaded yet. Please upload documents to start chatting.", []

        vector_store = FAISS.load_local(self.vector_db_path, self.embeddings)
        
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
            retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
            return_source_documents=True,
            chain_type_kwargs={"prompt": PROMPT}
        )
        
        result = qa_chain.invoke({"query": question})
        
        sources = [doc.metadata.get("source", "Unknown") for doc in result["source_documents"]]
        return result["result"], list(set(sources))

rag_engine = RAGEngine()
