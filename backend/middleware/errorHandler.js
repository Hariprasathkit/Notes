function errorHandler(error, req, res, next) {

// If the response headers have already been sent, delegate to the default Express error handler

  if (res.headersSent) {
    return next(error);
  }

  // Handle specific error types and return appropriate HTTP status codes and messages

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'invalid JSON request body' });
  }

  // Handle request body size limit errors and return a 413 Payload Too Large status code

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'request body is too large' });
  }

  // Handle Mongoose validation errors and return a 400 Bad Request status code with the first validation error message

  if (error.name === 'ValidationError') {
    const firstError = Object.values(error.errors)[0];
    return res.status(400).json({ error: firstError.message });
  }

  // Handle Mongoose duplicate key errors and return a 409 Conflict status code with a message indicating the duplicate field

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'invalid note ID' });
  }

  // Handle Mongoose duplicate key errors and return a 409 Conflict status code with a message indicating the duplicate field

  if (
    error.name === 'MongoServerSelectionError' ||
    error.name === 'MongooseServerSelectionError' ||
    error.name === 'MongoNetworkError'
  ) {
    return res.status(503).json({ error: 'database unavailable' });
  }

  console.error(error);
  return res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'internal server error' : error.message,
  });
}

module.exports = errorHandler;
