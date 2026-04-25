// Pinecone vector database configuration
const { Pinecone } = require('@pinecone-database/pinecone');

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const initPinecone = async () => {
  try {
    const indexName = process.env.PINECONE_INDEX_NAME || 'ai-medical';

  
    const existingIndexes = await pinecone.listIndexes();

    const exists = existingIndexes.indexes?.some(
      (i) => i.name === indexName
    );

    if (!exists) {
      console.log(`Creating Pinecone index: ${indexName}`);

      await pinecone.createIndex({
        name: indexName,
        dimension: 384, 
        metric: 'cosine',
      });

      console.log('Pinecone index created');
    } else {
      console.log('Pinecone index already exists');
    }

    return pinecone;

  } catch (error) {
    console.error(`Pinecone init error: ${error.message}`);
    throw new Error(`Pinecone initialization failed: ${error.message}`);
  }
};
module.exports = { pinecone, initPinecone };