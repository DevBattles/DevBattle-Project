// ===========================================
// XSS Sanitization Middleware
// ===========================================

/**
 * Recursively sanitize a value to prevent XSS attacks.
 * Strips HTML tags and dangerous characters from strings.
 * @param {*} value - Value to sanitize
 * @returns {*} Sanitized value
 */
const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === 'object') {
    const sanitized = {};
    for (const [key, val] of Object.entries(value)) {
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }

  return value;
};

/**
 * Express middleware that sanitizes request body, query, and params
 * to prevent Cross-Site Scripting (XSS) attacks.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
const sanitizeXSS = (req, _res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }

  if (req.query) {
    req.query = sanitizeValue(req.query);
  }

  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
};

export default sanitizeXSS;
