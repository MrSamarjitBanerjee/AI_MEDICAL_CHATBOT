// Embedding Service using Hugging Face 
const hf = require('../config/huggingface');
const logger = require('../utils/logger');

const EXPECTED_DIM = 384;
const MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

const generateEmbeddings = async (text) => {
  const trimmed = text?.trim() ?? '';
  logger.debug(`Generating embeddings for text length: ${trimmed.length}`);

  
  if (!trimmed) {
    throw new Error('generateEmbeddings called with empty or null text');
  }

  const response = await hf.featureExtraction({
    model: MODEL,
    inputs: trimmed,
  });

 
  const raw = Array.isArray(response?.[0]) ? response[0] : response;

  if (!Array.isArray(raw) || raw.length === 0) {
    
    throw new Error(`HF returned unexpected response shape: ${JSON.stringify(response)?.slice(0, 120)}`);
  }

  if (raw.length !== EXPECTED_DIM) {
    
    throw new Error(`Embedding dimension mismatch: expected ${EXPECTED_DIM}, got ${raw.length}`);
  }

  const embedding = raw.map(v => Number(v));

  
  const invalid = embedding.filter(v => !isFinite(v));
  if (invalid.length > 0) {
    throw new Error(`Embedding contains ${invalid.length} non-finite values`);
  }

  logger.debug(`Embeddings generated: dimension ${embedding.length}`);
  return embedding;
};

module.exports = { generateEmbeddings };