import env from '../config/env.js';

export default function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || error.status || 500;
  const message =
    statusCode === 500 && env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message || 'Something went wrong';

  if (res.headersSent) {
    return next(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV !== 'production' ? { stack: error.stack } : {})
  });
}