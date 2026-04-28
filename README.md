# AI Medical Chatbot

A RAG-powered medical assistant built with Node.js, leveraging embedding models and vector databases for semantic retrieval. The system uses a multi-stage pipeline: document ingestion, chunking, embedding generation, vector indexing, and context-aware response generation via LLMs.

Key Technologies
Component	Purpose
Node.js	Backend runtime
Embedding Model	Converts text to vectors (text-embedding-3-small)
Vector Database	Stores and searches embeddings efficiently
LLM API	Generates intelligent responses (GPT-4, etc.)
Express.js	REST API framework

## 📦 Dependencies & Technologies

Organized by Category:

---

## 📦 Dependencies & Technologies

🤖 AI & LLM Services  
├── openai (v6.33.0) # GPT-4 API integration ├── groq-sdk (v1.1.2) # Groq LLM support └── @huggingface/inference (v4.13.15) # HuggingFace model access

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
│MongoDB │ │ OpenAI  │ │ Pinecone   │
│Database│ │   API   │ │ Vector DB  │
└────────┘ └──────────┘ └────────────┘
```

---

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









## Architecture & Workflow

### Overall System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    USER REQUEST                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Express.js Server (server.js)            │  │
│  │  - Routes requests to appropriate endpoints      │  │
│  │  - Applies middleware (auth, rate limit, error)  │  │
│  └──────────────┬───────────────────────────────────┘  │
│                 │                                       │
│        ┌────────▼─────────┐                            │
│        │   Middlewares    │                            │
│        ├──────────────────┤                            │
│        │ - Auth Check     │                            │
│        │ - Rate Limiting  │                            │
│        │ - Error Handling │                            │
│        └────────┬─────────┘                            │
│                 │                                       │
│        ┌────────▼─────────────────┐                    │
│        │    Router Selection      │                    │
│        ├──────────────────────────┤                    │
│        │ /api/auth -> authRoutes  │                    │
│        │ /api/chat -> chatRoutes  │                    │
│        │ /api/rag -> ragRoutes    │                    │
│        └────────┬─────────────────┘                    │
│                 │                                       │
│        ┌────────▼──────────────┐                       │
│        │    Controllers        │                       │
│        ├──────────────────────┤                        │
│        │ - authController     │                        │
│        │ - chatController     │                        │
│        │ - ragController      │                        │
│        └────────┬──────────────┘                       │
│                 │                                       │
│        ┌────────▼──────────────────┐                   │
│        │      Services             │                   │
│        ├────────────────────────────┤                   │
│        │ - llmService              │                   │
│        │ - embeddingService        │                   │
│        │ - ragService              │                   │
│        │ - pdfService              │                   │
│        └────────┬────────────────────┘                 │
│                 │                                       │
│    ┌────────────┼────────────┐                         │
│    │            │            │                         │
│    ▼            ▼            ▼                         │
│  MongoDB    OpenAI API   Pinecone                      │
│  (Data)     (Intelligence) (Embeddings)               │
│                                                       │
└──────────────────────────────────────────────────────┘





```




## Data Pipeline (Document Ingestion)

```
┌──────────────────┐
│  Medical Docs    │
│  (PDF/TXT/JSON)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Ingestion      │
│   (Parse Files)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│   Text Chunking          │
│   (Split into Segments)  │
└────────┬─────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Embedding Generation      │
│  (Convert to Vectors)      │
└────────┬───────────────────┘
         │
         ▼
┌────────────────────────────┐
│  Vector Database Storage   │
│  (Index & Store)           │
└────────────────────────────┘
```


#### Authentication Flow (Signup/Login)
```
Client Request
      │
      ▼
Server Receives POST /api/auth/signup
      │
      ▼
Express Router → authRoutes.js
      │
      ▼
authController.js (signup function)
      │
      ├─ Validate email/password
      ├─ Hash password with bcryptjs
      ├─ Save to MongoDB
      └─ Generate JWT token
      │
      ▼
Send Response with Token
      │
      ▼
Client Receives Token (valid for 7 days)





## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Vector Database (Pinecone, Weaviate, or Milvus)
- LLM API Keys (OpenAI, Cohere, or similar)

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
# LLM Configuration
LLM_API_KEY=your_api_key_here
LLM_MODEL=gpt-4

# Vector Database
VECTOR_DB_URL=your_vector_db_url
VECTOR_DB_KEY=your_vector_db_key

# Embedding Model
EMBEDDING_MODEL=text-embedding-3-small

# Server
PORT=3000
NODE_ENV=development
```

## Quick Start

```bash
# Run tests
npm test

# Install new package
npm install package-name

# Check installed packages
npm list

# Remove package
npm uninstall package-name

# Check for security vulnerabilities
npm audit

# Create database backup (MongoDB)
mongodump --uri "mongodb://localhost:27017/ai-medical-assistant"

# Restore database
mongorestore --uri "mongodb://localhost:27017/" dump/
```

---


## Project Structure

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
---

                
                    
```
-----

---
```

## 📋 Medical Disclaimer

This chatbot is designed for **Personal project purposes only** and should not replace professional medical advice. Always consult with qualified healthcare professionals for medical decisions.

## License

MIT License - See LICENSE file for details


---

**Built with ❤️ for better healthcare By Samarjit Banerjee**
