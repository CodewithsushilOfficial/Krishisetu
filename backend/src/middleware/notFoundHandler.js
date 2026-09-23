/**
 * Centralized API Route Not Found Handler
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    error: {
      code: 'ROUTE_NOT_FOUND',
    },
  });
}

export default notFoundHandler;
