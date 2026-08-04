// ===========================================
// Async Handler Utility
// ===========================================

/**
 * Wraps an async route handler to catch errors and pass them to Express error middleware.
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
