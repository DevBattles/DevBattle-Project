export const Messages = {
  // Generic
  SUCCESS: 'Request processed successfully.',
  CREATED: 'Question created successfully.',
  UPDATED: 'Question updated successfully.',
  DELETED: 'Question deleted successfully.',

  // Auth / access
  UNAUTHORIZED: 'Authentication required. Provide a valid bearer token.',
  INVALID_TOKEN: 'Invalid or expired authentication token.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  TOKEN_MISSING: 'Authorization header is missing or malformed.',

  // Questions
  QUESTION_NOT_FOUND: 'Question not found.',
  QUESTION_LISTED: 'Questions retrieved successfully.',
  QUESTION_FETCHED: 'Question retrieved successfully.',
  QUESTION_STATUS_UPDATED: 'Question status updated successfully.',
  QUESTION_PUBLISHED: 'Question published successfully.',
  QUESTION_ARCHIVED: 'Question archived successfully.',
  QUESTION_DRAFTED: 'Question moved back to draft.',
  BOOKMARK_ADDED: 'Question bookmarked.',
  BOOKMARK_REMOVED: 'Bookmark removed.',
  BOOKMARKS_LISTED: 'Bookmarked questions retrieved successfully.',
  STATISTICS_FETCHED: 'Question statistics retrieved successfully.',

  // Internal (service-to-service)
  INTERNAL_QUESTION_FETCHED: 'Full question payload retrieved.',
  INTERNAL_STATS_RECORDED: 'Attempt statistics recorded.',

  // Validation
  VALIDATION_FAILED: 'Validation failed.',

  // System
  HEALTH_OK: 'Service is healthy.',
  NOT_FOUND: 'The requested resource was not found.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again later.',
} as const;
