# 🏥 MediAI - Medical Document Analysis AI Assistant

<div align="center">

![MediAI Logo](https://img.shields.io/badge/MediAI-Medical%20AI%20Assistant-blue?style=for-the-badge&logo=medical)
![React](https://img.shields.io/badge/React-18.0.0-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.12-009688?style=for-the-badge&logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=for-the-badge&logo=typescript)

**AI-powered medical document analysis with multi-language support using Google Gemini AI**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage)

</div>

---

## 🎯 Overview

MediAI is a sophisticated medical document analysis platform that leverages Google Gemini AI to provide intelligent insights from medical documents. Supports 20+ languages including Indian regional languages (Hindi, Telugu, Tamil, Kannada, Malayalam).

### Key Capabilities
- **📄 PDF Processing**: Extract and analyze medical PDFs
- **🧠 AI Analysis**: Advanced document understanding with Google Gemini 2.0 Flash Lite
- **🌍 Multi-language**: 20+ languages with real-time translation
- **🔍 Semantic Search**: FAISS-based vector search for accurate retrieval
- **💬 Interactive Chat**: Real-time Q&A interface
- **🎨 Modern UI**: Swiss-style design with smooth animations

---

## ✨ Features

### AI-Powered Analysis
- Intelligent PDF text extraction with PDFMiner
- Context-aware medical document understanding
- Semantic search using FAISS vector database
- Specialized medical terminology interpretation

### Multi-language Support
- **20+ Languages**: English, Hindi, Telugu, Tamil, Kannada, Malayalam, Spanish, French, German, Chinese, Arabic, Russian, Japanese, Portuguese, Italian, Dutch, Korean, Turkish, Polish
- Real-time translation with Google Translate
- Cultural adaptation for regional medical practices
- Bidirectional language support

### User Experience
- Modern Swiss design with excellent typography
- Fully responsive layout (desktop, tablet, mobile)
- Smooth animations and micro-interactions
- Accessibility compliant with keyboard navigation
- Suggested medical questions for easy start

### Security & Privacy
- Server-side processing only
- No data persistence (in-memory processing)
- Secure file handling with automatic cleanup
- CORS protection for secure requests

---

## 🖼️ Demo

**Demo Video**

Upload a single demo video showcasing the main dashboard, file upload, chat interface, multi-language support, and analysis results. Place your video in a `demo/` folder at the project root and reference it here:

```markdown
### Demo Video

<div align="center">
  <video src="medical.mp4" controls width="800"></video>
  <p><em>End-to-end walkthrough of MediAI features and workflow</em></p>
</div>
```

---

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Google Gemini AI** - Advanced language model
- **FAISS** - Vector similarity search
- **PDFMiner** - PDF text extraction
- **Deep Translator** - Multi-language translation
- **LangChain** - LLM application framework

### Frontend
- **React 18** - UI framework with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Lucide React** - Beautiful icons
- **React Dropzone** - File upload

---

## 🚀 Installation

### Prerequisites
- Node.js 18.0.0+
- Python 3.8+
- Google Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))

### Quick Start

```bash
# Clone repository
git clone https://github.com/durga221/medical-document-analysis.git
cd medical-document-analysis

# Backend setup
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
echo "GOOGLE_API_KEY=your_api_key" > .env

# Frontend setup
cd ../frontend
npm install
npm run dev

# Start backend (new terminal)
cd backend
python server.py
```

**Access URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 📖 Usage

### Getting Started
1. **Upload PDF**: Drag-drop or click to upload medical document
2. **Select Language**: Choose from 20+ supported languages
3. **Ask Questions**: Use chat interface or suggested questions
4. **Get Insights**: Receive AI-powered medical document analysis

### Example Queries
```
"What are the main findings in this medical report?"
"Summarize the patient's diagnosis and treatment plan"
"What medications are prescribed and their side effects?"
"Are there any important warnings or contraindications?"
"Explain the medical terminology in simple terms"
```

### Supported Languages
| Language | Code | Language | Code |
|----------|------|----------|------|
| English | en | Hindi | hi |
| Telugu | te | Tamil | ta |
| Kannada | kn | Malayalam | ml |
| Spanish | es | French | fr |
| German | de | Chinese | zh-CN |
| Arabic | ar | Russian | ru |
| Japanese | ja | Portuguese | pt |
| Italian | it | Dutch | nl |
| Korean | ko | Turkish | tr |
| Polish | pl | Bengali | bn |

---

## 🔌 API Reference

### Base URL: `http://localhost:8000`

#### POST `/upload`
Upload PDF document for processing.
```bash
curl -X POST "http://localhost:8000/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@medical_document.pdf"
```

#### POST `/query`
Ask questions about uploaded documents.
```json
{
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "question": "What are the main findings?",
  "language": "en"
}
```

#### GET `/languages`
Get list of supported languages.

#### GET `/health`
Health check endpoint.

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│ • File Upload   │    │ • PDF Processing│    │ • Google Gemini │
│ • Chat UI       │    │ • Vector DB     │    │ • Google Translate│
│ • Language Sel  │    │ • AI Response   │    │                 │
│ • Responsive    │    │ • Translation   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **Upload**: PDF → Text Extraction → Vector Database
2. **Query**: Question → Vector Search → AI Analysis → Translation → Response
3. **Security**: In-memory processing, no data persistence

---

## ⚙️ Configuration

### Environment Variables
Create `.env` in backend directory:
```env
GOOGLE_API_KEY=your_google_gemini_api_key
HOST=0.0.0.0
PORT=8000
DEBUG=false
ALLOWED_ORIGINS=http://localhost:5173
MAX_FILE_SIZE=10485760
```

---

## 📞 Support

- **GitHub**: [github.com/durga221](https://github.com/durga221)
- **LinkedIn**: [durgaramakrishnakapa](https://www.linkedin.com/in/durgaramakrishnakapa/)
- **Email**: k.durgaramakrishna2005@gmail.com

