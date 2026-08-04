// ===========================================
// UUID Helper Utility
// ===========================================

import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

/**
 * Generate a new UUID v4.
 * @returns {string} UUID string
 */
const generateUUID = () => {
  return uuidv4();
};

/**
 * Validate a UUID string.
 * @param {string} id - UUID to validate
 * @returns {boolean} True if valid UUID
 */
const isValidUUID = (id) => {
  return uuidValidate(id);
};

export { generateUUID, isValidUUID };
