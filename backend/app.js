const express = require('express');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Configure CORS to allow requests from the frontend URL specified in the environment variable or default to localhost:5173

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);

// Parse incoming JSON requests with a size limit of 16kb to prevent excessively large payloads

app.use(express.json({ limit: '16kb' }));

// Define a health check endpoint to verify that the server is running and responding correctly

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Mount the note routes under the /api/notes path, allowing for CRUD operations on notes

app.use('/api/notes', noteRoutes);

// Handle 404 errors for undefined routes by returning a JSON response with an error message

app.use((req, res) => res.status(404).json({ error: 'route not found' }));
app.use(errorHandler);

module.exports = app;
