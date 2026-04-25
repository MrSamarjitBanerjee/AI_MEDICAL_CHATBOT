require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const ragRoutes = require('./routes/ragRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { pinecone, initPinecone } = require('./config/pinecone');
const logger = require('./utils/logger');
const cors = require('cors');

const app = express();
app.use(cors());
// Connect DB
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static(path.join(__dirname, 'public')));
// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() }));

// // ── API Routes ──
// app.use('/api',       require('./routes/authRoutes'));
// app.use('/api/chat',  require('./routes/chatRoutes'));
// app.use('/api',       require('./routes/ragRoutes'));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/rag', ragRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});



const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initPinecone();
    logger.info("Pinecone initialized");
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;

