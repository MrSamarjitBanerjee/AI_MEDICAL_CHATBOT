# AI Medical Chatbot

A RAG-powered medical assistant built with Node.js, leveraging embedding models and vector databases for semantic retrieval. The system uses a multi-stage pipeline: document ingestion, chunking, embedding generation, vector indexing, and context-aware response generation via LLMs.

## Features

- 🏥 **Medical Knowledge Base** - Semantic search across medical documents
- 🔍 **Smart Retrieval** - RAG-powered context-aware responses
- 📄 **Document Processing** - Automatic chunking and embedding generation
- 🤖 **LLM Integration** - Multi-model support for response generation
- ⚡ **Fast Search** - Vector database optimization for quick retrieval
- 🔐 **Enterprise Ready** - Scalable and secure architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERFACE                               │
│                   (Chat Input/Query)                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    QUERY PROCESSING                              │
│         (Text Cleaning, Preprocessing, Intent Detection)        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EMBEDDING GENERATION                          │
│              (Convert Query to Vector Embeddings)               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  VECTOR DATABASE SEARCH                          │
│         (Semantic Similarity & Retrieve Top-K Documents)        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   CONTEXT ASSEMBLY                               │
│     (Combine Retrieved Documents + User Query into Prompt)      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LLM RESPONSE GENERATION                         │
│     (Generate Medical Response with Retrieved Context)          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              RESPONSE VALIDATION & FORMATTING                    │
│          (Verify Medical Accuracy & Format Output)              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER RESPONSE                                 │
│                   (Chatbot Answer)                               │
└─────────────────────────────────────────────────────────────────┘
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
# Start the server
npm start

# Run tests
npm test

# Ingest medical documents
npm run ingest -- --file documents/medical_data.pdf

# Query the chatbot
npm run query -- "What are the symptoms of diabetes?"
```

## Project Structure

```
AI_MEDICAL_CHATBOT/
├── src/
│   ├── api/              # Express routes
│   ├── services/         # Core business logic
│   ├── models/           # Data models
│   ├── utils/            # Helper functions
│   └── config/           # Configuration files
├── documents/            # Medical documents
├── scripts/              # Ingestion & utility scripts
├── tests/                # Test files
├── .env.example          # Environment template
└── package.json          # Dependencies
```

## 📋 Medical Disclaimer

This chatbot is designed for **informational purposes only** and should not replace professional medical advice. Always consult with qualified healthcare professionals for medical decisions.

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please submit pull requests to improve the project.

---

**Built with ❤️ for better healthcare**
