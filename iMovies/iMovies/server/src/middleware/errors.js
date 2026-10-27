
export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.status || (err.name === 'ValidationError' ? 400 : 500);
  if (process.env.NODE_ENV !== 'production') console.error(err);
  res.status(status).json({ message: status >= 500 ? 'Something went wrong. Please try again.' : err.message });
}
