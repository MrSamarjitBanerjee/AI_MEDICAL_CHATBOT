// Centralized Service Loader
const { getResponse } = require('./llmService');
const { generateEmbeddings } = require('./embeddingService');
const { retrieveContext } = require('./ragService');
const { extractTextFromPDF } = require('./pdfService');

module.exports = {
  getResponse,
  generateEmbeddings,
  retrieveContext,
  extractTextFromPDF,
};