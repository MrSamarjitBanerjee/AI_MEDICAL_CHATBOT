// Embedding Model
const mongoose = require('mongoose');

const embeddingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  embeddings: { type: [Number], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Embedding', embeddingSchema);