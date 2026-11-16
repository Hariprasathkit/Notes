function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'invalid JSON request body' });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({ error: 'request body is too large' });
  }

  if (error.name === 'ValidationError') {
    const firstError = Object.values(error.errors)[0];
    return res.status(400).json({ error: firstError.message });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'invalid note ID' });
  }

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
