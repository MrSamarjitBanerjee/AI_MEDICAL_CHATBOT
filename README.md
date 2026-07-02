# AI Medical Chatbot

A RAG-powered medical assistant built with Node.js, leveraging embedding models and vector databases for semantic retrieval. The system uses a multi-stage pipeline: document ingestion, chunking, embedding generation, vector indexing, and context-aware response generation via LLMs.

Key Technologies:-
Node.js	for Backend runtime,
The Embedding Model	Converts text to vectors (text-embedding-3-small).
The Vector Database	Stores and searches embeddings efficiently.
The LLM API	Generates intelligent responses (GROK, Llama , GPT-4, etc.).
Express.js	REST API framework.

## 📦 Dependencies & Technologies

Organized by Category:

---

## 📦 Dependencies & Technologies

🤖 AI & LLM Services  
├── # Groq LLM support
└── @huggingface/inference (v4.13.15) # HuggingFace model access




🗄️ Vector Database - Pinecone

└── @pinecone-database/pinecone (v7.1.0) # Vector database for semantic search  




📄 Document Processing - PDF parsing & generation tools

├── pdf-parse (v1.1.1) # PDF text extraction ├── pdfjs-dist (v5.6.205) # PDF rendering & parsing └── pdfkit (v0.18.0) # PDF document generation




🌐 Backend Framework - Express, Axios, form-data

├── express (v5.2.1) # REST API framework ├── axios (v1.14.0) # HTTP client for API calls └── form-data (v4.0.5) # Multipart form data handling



🔐 Security & Auth - JWT, bcryptjs, CORS, rate-limiting

├── jsonwebtoken (v9.0.3) # JWT token generation & verification ├── bcryptjs (v3.0.3) # Password hashing & encryption ├── cors (v2.8.6) # Cross-Origin Resource Sharing └── express-rate-limit (v8.3.2) # Rate limiting middleware




💾 Database - Mongoose/MongoDB

└── mongoose (v9.4.1) # MongoDB object modeling




📤 File Upload - Multer

└── multer (v2.1.1) # Middleware for file uploads




🛠️ Configuration - dotenv

└── dotenv (v17.4.0) # Environment variable managemen





### Tech Stack
 


---
```
┌─────────────────────────────────────────┐
│        Frontend/Client Layer             │
│    (Not included in this project)        │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────────┐
│      Express.js Web Server               │
│      (server.js - Port 5000)             │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
    ▼          ▼          ▼
┌────────┐ ┌──────────┐ ┌────────────┐
│MongoDB │ │   GROK  │ │ Pinecone   │
│Database│ │   API   │ │ Vector DB  │
└────────┘ └──────────┘ └────────────┘
```

---
<img width="1918" height="1074" alt="AI_CHATBOT_IMG1" src="https://github.com/user-attachments/assets/3df5eeb3-8e78-4786-8e1d-26e908980a56" />
<img width="1917" height="1069" alt="AI_CHATBOT_IMG2" src="https://github.com/user-attachments/assets/cce6ee92-259d-49c3-914d-d8ca79658f22" />
<img width="1833" height="982" alt="Chatbot_img3" src="https://github.com/user-attachments/assets/71ff3ae5-7420-4b9a-a1aa-0610182f9305" />




# AI Medical Chatbot - Project Overview

## **How It Works (End-to-End)**

### **1. Document Ingestion Phase**
- Medical documents (PDFs, text files, JSON) are loaded into the system
- Documents are parsed and extracted for text content
- Large documents are split into manageable chunks.

### **2. Embedding Generation**
- Each document chunk is converted into a numerical vector (embedding) using an embedding model
- These embeddings capture the semantic meaning of the text
- Embeddings are stored in a vector database (Pinecone, Weaviate, etc.) with their metadata

### **3. Query Processing**
When a user asks a question:
- The query text is cleaned and preprocessed
- The same embedding model converts the user query into a vector
- The system searches the vector database for similar embeddings (semantic similarity search)
- Top-K most relevant document chunks are retrieved based on cosine similarity

### **4. Context Assembly**
- Retrieved medical documents are combined with the original query
- A prompt is constructed: "Here is relevant medical context: [documents]. Now answer this question: [user query]"
- This provides the LLM with specific, relevant information

### **5. LLM Response Generation**
- The assembled prompt is sent to a Large Language Model (Grok,GPT-4, Cohere, etc.)
- The LLM generates a medical response using:
  - The retrieved relevant documents (grounded information)
  - Its trained knowledge
  - Medical context from the prompt

### **6. Response Delivery**
- Response is validated for medical accuracy
- Formatted and returned to the user
- System logs the interaction for improvement
---

**Result:** Accurate, trustworthy medical chatbot powered by real medical data! 🏥



## Prerequisites

- Node.js >= 18.0.0
- npm 
- Vector Database (Pinecone)
- LLM API Keys (Grok,OpenRouter,huggingface)

## Installation

```bash
# Clone the repository
git clone https://github.com/MrSamarjitBanerjee/AI_MEDICAL_CHATBOT.git
cd AI_MEDICAL_CHATBOT

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

## Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/ai-medical-assistant

# JWT Configuration
JWT_SECRET=

# Groq Configuration (free llama3-70b for chat)
GROQ_API_KEY=

# Hugging Face Configuration (free embeddings)
HUGGINGFACE_API_KEY=

# Pinecone Configuration
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=gcp-starter
PINECONE_INDEX_NAME=medical-assistant-index

# Node Environment
NODE_ENV=development
```

## Quick Start

```bash
# Install new package
npm install

# Check installed packages
npm list


# Check for security vulnerabilities
npm audit

# start the server
npm start 


## Project Structure

```
```
AI Medical Assistant/
│
├── config/                       # Configuration & connection setup
│   ├── db.js                    # MongoDB connection
│   ├── openai.js                # OpenAI client initialization
│   ├── pinecone.js              # Pinecone client initialization
│   └── index.js                 # Centralized config exports
│
├── controllers/                  # HTTP request handlers
│   ├── authController.js        # signup(), login()
│   ├── chatController.js        # handleChat()
│   └── ragController.js         # uploadPDF(), handleQuery()
│
├── middlewares/                  # Express middleware functions
│   ├── authMiddleware.js        # JWT verification
│   ├── errorMiddleware.js       # Global error handling
│   └── rateLimiter.js           # Rate limiting
│
├── models/                       # Mongoose database schemas
│   ├── User.js                  # User schema
│   ├── ChatMessage.js           # Chat message schema
│   └── Embedding.js             # Embedding schema
│
├── routes/                       # API route definitions
│   ├── authRoutes.js            # /api/auth endpoints
│   ├── chatRoutes.js            # /api/chat endpoints
│   └── ragRoutes.js             # /api/rag endpoints
│
├── services/                     # Business logic & external APIs
│   ├── llmService.js            # OpenAI chat integration
│   ├── embeddingService.js      # OpenAI embedding generation
│   ├── ragService.js            # RAG context retrieval
│   ├── pdfService.js            # PDF text extraction
│   └── index.js                 # Service exports
│
├── utils/                        # Utility functions
│   ├── jwtUtils.js              # JWT token operations
│   ├── logger.js                # Logging utility
│   └── responseHandler.js       # Standardized API responses
│
├── node_modules/                # npm dependencies (107 packages)
│
├── .env                         # Environment variables (CRITICAL)
├── .gitignore                   # Git exclusions
├── package.json                 # Dependencies & scripts
├── package-lock.json            # Dependency versions lock
│
├── server.js                    # Application entry point
├── test.js                      # Basic test script
├── comprehensive-test.js        # Full endpoint testing
│
├── README.md                    # Project overview
├── SETUP_GUIDE.md              # Installation & setup
├── PROJECT_COMPLETION.md        # Completion summary
└── DEVELOPER_GUIDE.md          # This file


```
```

## 📋 Medical Disclaimer

This chatbot is designed for **Personal project purposes only** and should not replace professional medical advice. Always consult with qualified healthcare professionals for medical decisions.

## License

MIT License - See LICENSE file for details


---

**Built with ❤️ for better healthcare By Samarjit Banerjee**
