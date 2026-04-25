// ragService.js
const { pinecone } = require('../config/pinecone');
const { generateEmbeddings } = require('./embeddingService');
const Embedding = require('../models/Embedding');
const logger = require('../utils/logger');

const CHUNK_SIZE = 800;

const chunkText = (text) => {
  const chunks = [];
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  let index = 0;
  while (index < sentences.length) {
    let chunk = '';
    let i = index;

    while (i < sentences.length && (chunk + sentences[i]).length < CHUNK_SIZE) {
      chunk += sentences[i] + ' ';
      i++;
    }

    chunk = chunk.trim();

    if (chunk.length > 30) {
      chunks.push(chunk);
    }

    const nextIndex = i;
    index = (nextIndex > index + 1) ? nextIndex - 1 : nextIndex;

    if (index <= i - (nextIndex === index ? 0 : 2) && i === sentences.length) break;
  }

  if (chunks.length === 0 && text.trim().length > 20) {
    chunks.push(text.trim().slice(0, CHUNK_SIZE));
  }

  return chunks;
};

const upsertChunks = async (userId, chunks, filename) => {
  if (!chunks || chunks.length === 0) {
    logger.warn(`No chunks for ${filename}`);
    return 0;
  }

  const indexName = process.env.PINECONE_INDEX_NAME || 'ai-medical';
  const index = pinecone.index(indexName);
  const records = [];

  for (let k = 0; k < chunks.length; k++) {
    try {
      const chunk = chunks[k];
      if (!chunk || chunk.length < 5) {
        logger.warn(`Chunk ${k} skipped: too short`);
        continue;
      }

      const finalEmbedding = await generateEmbeddings(chunk);

      await Embedding.create({
        user: userId,
        text: chunk,
        embeddings: finalEmbedding
      }).catch(err => logger.error(`DB Error: ${err.message}`));

      
      records.push({
        id: `${userId}-${k}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        values: finalEmbedding,
        metadata: {
          userId: userId.toString(),
          filename: String(filename),
          text: String(chunk)
        }
      });

      logger.debug(`Record ${k} ready — dim: ${finalEmbedding.length}`);

    } catch (e) {
      logger.error(`Chunk ${k} failed: ${e.message}`);
    }
  }

  logger.debug(`Records prepared for upsert: ${records.length}`);

  if (records.length === 0) {
    logger.error('No records survived processing — check embedding dimension and chunk filtering.');
    return 0;
  }

  try {
    
    await index.upsert({ records });
    logger.info(`Successfully upserted ${records.length} records to Pinecone`);
    return records.length;
  } catch (error) {
    logger.error(`Upsert failed: ${error.message}`);
    logger.error(`First record sample: ${JSON.stringify({
      id: records[0].id,
      valuesDim: records[0].values.length,
      metadata: records[0].metadata
    })}`);
    throw error;
  }
};

const retrieveContext = async (userId, query) => {
  try {
    const indexName = process.env.PINECONE_INDEX_NAME || 'ai-medical';
    const index = pinecone.index(indexName);

    const finalEmbedding = await generateEmbeddings(query);

    
    const response = await index.query({
      vector: finalEmbedding,
      topK: 5,
      filter: { userId: { '$eq': userId.toString() } },
      includeMetadata: true,
    });

    if (!response.matches || response.matches.length === 0) {
      return 'No relevant context found.';
    }

    return response.matches
      .filter(m => m.metadata?.text)
      .map(m => m.metadata.text)
      .slice(0, 3)
      .join('\n\n');

  } catch (e) {
    logger.error(`Retrieve failed: ${e.message}`);
    return 'Context retrieval unavailable.';
  }
};

module.exports = { chunkText, upsertChunks, retrieveContext };