// RAG Controller
const logger = require('../utils/logger');
const { extractTextFromPDF } = require('../services/pdfService');
const { chunkText, upsertChunks, retrieveContext } = require('../services/ragService');
const { getResponse } = require('../services/llmService');

const uploadPDF = async (req, res, next) => {
  try {
    const { file } = req;
    const userId = req.user.id;
    const filename = file?.originalname || 'unknown.pdf';

    if (!file) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files allowed' });
    }

    
    if (file.size < 1000) {
      return res.status(400).json({
        error: `File too small (${file.size} bytes) — this PDF appears to be empty or corrupted`
      });
    }

    logger.info(`[${userId}] Uploading PDF: ${filename} (${file.size} bytes)`);

    
    let text;
    try {
      text = await extractTextFromPDF(file.buffer);
    } catch (pdfErr) {
      if (pdfErr.message.startsWith('PDF_UNREADABLE')) {
        return res.status(422).json({
          error: 'Your PDF could not be read. It may be corrupted, password-protected, or in an unsupported format. Please try a different file.'
        });
      }
      if (pdfErr.message.startsWith('PDF_NO_TEXT')) {
        return res.status(422).json({
          error: 'Your PDF appears to be a scanned image with no extractable text. Please upload a text-based PDF.'
        });
      }
      if (pdfErr.message.startsWith('Invalid file type')) {
        return res.status(400).json({ error: pdfErr.message });
      }
      
      throw pdfErr;
    }

    
    if (!text?.trim()) {
      return res.status(422).json({
        error: 'No text could be extracted from this PDF. Please ensure it is not blank or image-only.'
      });
    }

    const chunks = chunkText(text);
    if (chunks.length === 0) {
      return res.status(422).json({
        error: 'PDF text was too short or fragmented to index. Please upload a document with more content.'
      });
    }

    const numUpserted = await upsertChunks(userId, chunks, filename);

    res.status(201).json({
      success: true,
      message: 'PDF processed and indexed successfully',
      filename,
      total_chunks: chunks.length,
      upserted: numUpserted,
      text_length: text.length
    });

  } catch (error) {
    logger.error(`[${req.user?.id || 'unknown'}] PDF upload error: ${error.message}`);
    next(error);
  }
};

const queryRAG = async (req, res, next) => {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Valid "query" string is required' });
    }

    const cleanQuery = query.trim();
    logger.info(`[${userId}] RAG query: ${cleanQuery.substring(0, 100)}`);

    const context = await retrieveContext(userId, cleanQuery);

    const USELESS_PHRASES = [
      'document content unavailable',
      'pdf file integrity',
      'format error',
      'no relevant context',
      'context retrieval unavailable',
      'emergency fallback',
    ];

    const contextLower = context.toLowerCase();
    const isUselessContext =
      context.length < 50 ||
      USELESS_PHRASES.some(phrase => contextLower.includes(phrase));

    if (isUselessContext) {
      logger.warn(`[${userId}] Context is fallback/error text — not sending to LLM`);
      return res.json({
        success: true,
        answer: 'No usable content was found in your uploaded documents. The file may have been corrupted or unreadable during upload. Please try re-uploading a valid PDF.',
        context_used: false,
        context_preview: null,
        query: cleanQuery
      });
    }

    const systemPrompt = `You are an expert medical assistant.
Use ONLY the following context from the user's uploaded documents to answer their question.
If the context does not cover the question, say exactly: "I don't have information on that from your uploaded documents."
Do not use any outside knowledge. Be concise and professional.

Context:
${context}`;

    const answer = await getResponse(cleanQuery, systemPrompt);

    res.json({
      success: true,
      answer: answer.trim(),
      context_used: true,
      context_preview: context.length > 200
        ? context.substring(0, 200) + '...'
        : context,
      query: cleanQuery
    });

  } catch (error) {
    logger.error(`[${req.user?.id || 'unknown'}] RAG query error: ${error.message}`);
    next(error);
  }
};

module.exports = { uploadPDF, queryRAG };