# Walkthrough: Enterprise AI Chatbot with RAG

Welcome to your Enterprise AI Chatbot! This system allows you to upload documents and ask questions about them using a Retrieval-Augmented Generation (RAG) pipeline.

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js & npm
- MongoDB (optional for basic features, but recommended)
- OpenAI API Key (or Groq/Ollama)

### 2. Backend Setup
1.  Navigate to the `backend` directory.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure your `.env` file with your `OPENAI_API_KEY`.
4.  Run the FastAPI server:
    ```bash
    python -m app.main
    ```
    The API will be available at `http://localhost:8000`.

### 3. Frontend Setup
1.  Navigate to the `frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The web app will be available at `http://localhost:5173`.

## 🛠 Features

### 📄 Document Ingestion
- Go to the **Upload** page.
- Drag and drop PDF, DOCX, or TXT files.
- Alternatively, enter a website URL to scrape its content.
- Documents are automatically chunked, embedded, and stored in a local FAISS vector database.

### 💬 Contextual Chat
- Go to the **Chat** page.
- Ask questions about your uploaded data.
- The system will retrieve relevant context and generate an answer.
- **Source Citations**: Every answer includes references to the source documents for transparency.

### 📊 Dashboard
- Monitor your knowledge base and system activity in the **Dashboard**.
- View total users, documents indexed, and query statistics.

### 🤖 AI Agent
- Advanced capabilities like document summarization are built-in (accessible via the API/Dashboard).

## 🔒 Security
- JWT-based authentication is implemented for secure access.
- All data stays within your control, and hallucination control is enforced through rigorous prompt engineering.
