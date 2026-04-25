const {InferenceClient } = require('@huggingface/inference');
require('dotenv').config();

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY || '');

module.exports = hf;
