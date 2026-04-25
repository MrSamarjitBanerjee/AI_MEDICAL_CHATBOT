// Chat Message Model
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  sender: { type: String, enum: ['user', 'bot'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);