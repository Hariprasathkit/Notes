const express = require('express');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);
app.use(express.json({ limit: '16kb' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/notes', noteRoutes);
app.use((req, res) => res.status(404).json({ error: 'route not found' }));
app.use(errorHandler);

module.exports = app;
