from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import uuid
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings.fastembed import FastEmbedEmbeddings
from langchain_community.vectorstores import FAISS
import google.generativeai as genai
from deep_translator import GoogleTranslator
from extraction import extract_pdf_text
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure the Google Generative AI API
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

app = FastAPI(title="MultiLingual Medical RAG API", 
              description="API for querying medical contexts in multiple languages",
              version="1.0.0")

# Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for vector databases
vector_databases = {}

# Available languages for translation
LANGUAGES = {
  "English": "en",
  "Hindi": "hi",
  "Telugu": "te",
  "Kannada": "kn",
  "Tamil": "ta",
  "Malayalam": "ml",
  "Spanish": "es",
  "French": "fr",
  "German": "de",
  "Chinese (Simplified)": "zh-CN",
  "Arabic": "ar",
  "Russian": "ru",
  "Japanese": "ja",
  "Portuguese": "pt",
  "Italian": "it",
  "Dutch": "nl",
  "Korean": "ko",
  "Turkish": "tr",
  "Polish": "pl"
}

def create_vector_database(context):
    """Create FAISS vector database from text content"""
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
        
    chunks = text_splitter.split_text(context)
    embeddings = FastEmbedEmbeddings(model="ms-marco-MiniLM-L-12-v2")
    vector_database = FAISS.from_texts(chunks, embeddings)
    return vector_database

def translate_text(text, target_language):
    """Translate text to target language"""
    if target_language == "en":  # No translation needed for English
        return text
    
    try:
        translator = GoogleTranslator(source='auto', target=target_language)
        # Split long text into smaller chunks to avoid translation limits
        max_chunk_size = 4900  # Google Translate has a limit around 5000 chars
        if len(text) <= max_chunk_size:
            return translator.translate(text)
        
        # Handle long text by splitting and translating in chunks
        chunks = [text[i:i+max_chunk_size] for i in range(0, len(text), max_chunk_size)]
        translated_chunks = [translator.translate(chunk) for chunk in chunks]
        return "".join(translated_chunks)
    except Exception as e:
        print(f"Translation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")

def generate_response(question, vector_database, target_language):
    """Generate response based on similar documents and translate if needed"""
    try:
        # Get similar documents from vector database
        similar_docs = vector_database.similarity_search(question)
        
        # Format similar docs for prompt
        context_text = "\n\n".join([doc.page_content for doc in similar_docs])
        
        # Initialize the LLM
        llm = genai.GenerativeModel(model_name="gemini-2.0-flash-lite")
        
        # Construct prompt with medical context
        prompt_template = f"""
        Context: {context_text}
        
        Task: You are a specialized medical information assistant. Based on the provided context from medical documents, 
        answer the following question with a detailed and clear explanation. Include relevant medical terminology 
        when appropriate, but explain complex terms. Cite specific sections from the documents when possible.
        If the information isn't in the context, honestly state that you don't have enough information to answer accurately.
        
        Question: {question}
        """
        
        # Generate response
        result = llm.generate_content(prompt_template)
        response_text = result.text
        
        # Translate the response if not English
        if target_language != "en":
            translated_result = translate_text(response_text, target_language)
            return translated_result
        
        return response_text
    except Exception as e:
        print(f"Error generating response: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a PDF file, extract text, and create a vector database.
    
    - **file**: The PDF file to process
    """
    try:
        # Extract text from PDF
        pdf_content = await file.read()
        context = extract_pdf_text(pdf_content)
        
        if not context:
            raise HTTPException(status_code=400, detail="Could not extract text from the PDF.")
        
        # Create vector database
        vector_database = create_vector_database(context)
        
        # Generate a unique ID for the document
        document_id = str(uuid.uuid4())
        
        # Store the vector database in memory
        vector_databases[document_id] = vector_database
        
        return {
            "document_id": document_id,
            "filename": file.filename,
            "message": "File processed successfully."
        }
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

class QueryRequest(BaseModel):
    document_id: str
    question: str
    language: str = "en"

@app.post("/query")
async def query_context(request: QueryRequest):
    """
    Process a medical context and answer a question in the specified language.
    
    - **document_id**: The ID of the processed document
    - **question**: The medical question to answer based on the context
    - **language**: The language code or name for the response (default: en)
    """
    try:
        # Validate the language
        target_lang_code = request.language
        
        # Handle if language name is provided instead of code
        if request.language in LANGUAGES:
            target_lang_code = LANGUAGES[request.language]
        elif request.language not in LANGUAGES.values():
            # If neither a valid code nor name, default to English
            target_lang_code = "en"

        # Retrieve the vector database from memory
        vector_database = vector_databases.get(request.document_id)
        if not vector_database:
            raise HTTPException(status_code=404, detail="Document not found. Please upload the document again.")
        
        # Generate response
        response_text = generate_response(request.question, vector_database, target_lang_code)
        
        return {
            "response": response_text,
            "language": target_lang_code
        }
    except Exception as e:
        print(f"Error processing query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/languages")
async def get_languages():
    """Get the list of supported languages"""
    return LANGUAGES

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "api": "MultiLingual Medical RAG",
        "version": "1.0.0",
        "endpoints": [
            {"path": "/", "method": "GET", "description": "This information"},
            {"path": "/health", "method": "GET", "description": "Health check endpoint"},
            {"path": "/languages", "method": "GET", "description": "Get supported languages"},
            {"path": "/upload", "method": "POST", "description": "Upload a PDF document for processing"},
            {"path": "/query", "method": "POST", "description": "Process medical context and answer questions"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)