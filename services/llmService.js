// LLM Service using Groq 
const groq = require('../config/groq');
const logger = require('../utils/logger');

const getResponse = async (message, systemPrompt = '') => {
  logger.debug('LLM getResponse called');

  try {
    let messages = [];

    if (Array.isArray(message)) {
      messages = message.map(msg => ({
        role: msg.role,
        content: String(msg.content)
      }));
    } else {
      if (!message) throw new Error('Empty message');
      messages = [{ role: 'user', content: String(message) }];
    }

    if (systemPrompt) {
      messages.unshift({ role: 'system', content: systemPrompt });
    }

    logger.debug(`Calling Groq with ${messages.length} messages`);

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    logger.debug('LLM response generated successfully');
    return content;

  } catch (error) {
    logger.error(`LLM error: ${error.message}`, { code: error.code, name: error.name });
    throw new Error(`LLM request failed: ${error.message}`);
  }
};

const getStreamingResponse = async (input, systemPrompt = '') => {
  logger.debug('LLM streaming response requested');

  try {
    let messages = [];

    if (!input) throw new Error('Empty input');

    if (Array.isArray(input)) {
      messages = input.map(msg => ({
        role: msg.role,
        content: String(msg.content)
      }));
    } else {
      messages = [{ role: 'user', content: String(input) }];
    }

    if (systemPrompt) {
      messages.unshift({ role: 'system', content: systemPrompt });
    }

    const stream = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7,
      stream: true,
    });

    return stream;

  } catch (error) {
    logger.error(`LLM streaming error: ${error.message}`);
    throw new Error('Failed to get streaming response from LLM');
  }
};

module.exports = { getResponse, getStreamingResponse };

