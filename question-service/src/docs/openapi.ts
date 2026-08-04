/**
 * OpenAPI path & component definitions for the Question Service.
 * Merged into the full document in src/swagger/index.ts.
 */

const questionRef = '#/components/schemas/Question';
const questionSummaryRef = '#/components/schemas/QuestionSummary';
const paginationRef = '#/components/schemas/Pagination';
const errorRef = '#/components/schemas/Error';

export const openapiComponents = {
  schemas: {
    Question: {
      type: 'object',
      required: ['id', 'title', 'slug', 'description', 'type', 'difficulty', 'status', 'createdBy'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        slug: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string', enum: ['dsa', 'frontend', 'fullstack'] },
        difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard', 'Expert'] },
        category: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        companies: { type: 'array', items: { type: 'string' } },
        technology: { type: 'array', items: { type: 'string' } },
        requirements: { type: 'array', items: { type: 'string' } },
        constraints: { type: 'array', items: { type: 'string' } },
        acceptanceRate: { type: 'number' },
        estimatedMinutes: { type: 'integer' },
        timeLimitMs: { type: 'integer' },
        memoryLimitMb: { type: 'integer' },
        isPremium: { type: 'boolean' },
        status: { type: 'string', enum: ['draft', 'published', 'archived'] },
        createdBy: { type: 'string', format: 'uuid' },
        attemptedCount: { type: 'integer' },
        solvedCount: { type: 'integer' },
        publishedAt: { type: 'string', format: 'date-time', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        isBookmarked: { type: 'boolean' },
        examples: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              input: { type: 'string' },
              output: { type: 'string' },
              explanation: { type: 'string', nullable: true },
            },
          },
        },
        starterCode: { type: 'object', additionalProperties: { type: 'string' } },
        testCases: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              input: { type: 'string' },
              expectedOutput: { type: 'string' },
              isHidden: { type: 'boolean' },
              isSample: { type: 'boolean' },
              sortOrder: { type: 'integer' },
            },
          },
        },
      },
    },
    QuestionSummary: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string' },
        slug: { type: 'string' },
        type: { type: 'string', enum: ['dsa', 'frontend', 'fullstack'] },
        difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard', 'Expert'] },
        category: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
        companies: { type: 'array', items: { type: 'string' } },
        technology: { type: 'array', items: { type: 'string' } },
        acceptanceRate: { type: 'number' },
        estimatedMinutes: { type: 'integer' },
        status: { type: 'string', enum: ['draft', 'published', 'archived'] },
        createdBy: { type: 'string', format: 'uuid' },
        attemptedCount: { type: 'integer' },
        solvedCount: { type: 'integer' },
        testCaseCount: { type: 'integer' },
        hiddenTestCaseCount: { type: 'integer' },
        isBookmarked: { type: 'boolean' },
      },
    },
    Pagination: {
      type: 'object',
      properties: {
        page: { type: 'integer' },
        limit: { type: 'integer' },
        total: { type: 'integer' },
        totalPages: { type: 'integer' },
        hasNext: { type: 'boolean' },
        hasPrev: { type: 'boolean' },
      },
    },
    Error: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string' },
        errors: { type: 'array', items: { type: 'object' } },
      },
    },
  },
};

const paginatedQuestions = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string' },
    data: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { $ref: questionSummaryRef } },
        pagination: { $ref: paginationRef },
      },
    },
  },
};

const questionResponse = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string' },
    data: { $ref: questionRef },
  },
};

const errorResponse = {
  description: 'Error',
  content: { 'application/json': { schema: { $ref: errorRef } } },
};

const unauthorizedResponse = {
  description: 'Unauthorized',
  content: { 'application/json': { schema: { $ref: errorRef } } },
};

export const openapiPaths = {
  '/health': {
    get: {
      tags: ['System'],
      summary: 'Health check',
      security: [],
      responses: {
        200: {
          description: 'Service is healthy',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: {
                    type: 'object',
                    properties: {
                      status: { type: 'string' },
                      service: { type: 'string' },
                      environment: { type: 'string' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/questions': {
    get: {
      tags: ['Questions'],
      summary: 'List questions',
      description:
        'Students see published questions only. Mentors/admins may filter by status and receive hidden test-case counts.',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20, maximum: 100 } },
        { name: 'search', in: 'query', schema: { type: 'string' } },
        {
          name: 'difficulty',
          in: 'query',
          schema: { type: 'string', enum: ['Easy', 'Medium', 'Hard', 'Expert'] },
        },
        {
          name: 'type',
          in: 'query',
          schema: { type: 'string', enum: ['dsa', 'frontend', 'fullstack'] },
        },
        { name: 'category', in: 'query', schema: { type: 'string' } },
        { name: 'tag', in: 'query', schema: { type: 'string' } },
        { name: 'technology', in: 'query', schema: { type: 'string' } },
        {
          name: 'status',
          in: 'query',
          schema: { type: 'string', enum: ['draft', 'published', 'archived'] },
        },
        { name: 'bookmarked', in: 'query', schema: { type: 'boolean' } },
        {
          name: 'sortBy',
          in: 'query',
          schema: {
            type: 'string',
            enum: [
              'title',
              'difficulty',
              'acceptanceRate',
              'estimatedMinutes',
              'createdAt',
              'updatedAt',
            ],
          },
        },
        { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'] } },
      ],
      responses: {
        200: {
          description: 'Paginated question summaries',
          content: { 'application/json': { schema: paginatedQuestions } },
        },
        401: unauthorizedResponse,
      },
    },
    post: {
      tags: ['Questions'],
      summary: 'Create a question (mentor/admin)',
      description:
        'Questions are created in `draft` status and must be published before students can see them.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title', 'description'],
              properties: {
                title: { type: 'string', maxLength: 255 },
                description: { type: 'string' },
                type: { type: 'string', enum: ['dsa', 'frontend', 'fullstack'] },
                difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard', 'Expert'] },
                category: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                companies: { type: 'array', items: { type: 'string' } },
                technology: { type: 'array', items: { type: 'string' } },
                requirements: { type: 'array', items: { type: 'string' } },
                constraints: { type: 'array', items: { type: 'string' } },
                estimatedMinutes: { type: 'integer' },
                timeLimitMs: { type: 'integer' },
                memoryLimitMb: { type: 'integer' },
                isPremium: { type: 'boolean' },
                examples: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      input: { type: 'string' },
                      output: { type: 'string' },
                      explanation: { type: 'string' },
                    },
                  },
                },
                starterCode: { type: 'object', additionalProperties: { type: 'string' } },
                testCases: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      input: { type: 'string' },
                      expectedOutput: { type: 'string' },
                      isHidden: { type: 'boolean' },
                      isSample: { type: 'boolean' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Question created',
          content: { 'application/json': { schema: questionResponse } },
        },
        401: unauthorizedResponse,
        403: { description: 'Forbidden — requires mentor or admin role' },
        422: errorResponse,
      },
    },
  },
  '/questions/bookmarks': {
    get: {
      tags: ['Questions'],
      summary: 'List my bookmarked questions',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
      ],
      responses: {
        200: {
          description: 'Paginated bookmarked questions',
          content: { 'application/json': { schema: paginatedQuestions } },
        },
        401: unauthorizedResponse,
      },
    },
  },
  '/questions/statistics': {
    get: {
      tags: ['Questions'],
      summary: 'Question bank statistics (admin)',
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Aggregate statistics' },
        401: unauthorizedResponse,
        403: { description: 'Forbidden — requires admin role' },
      },
    },
  },
  '/questions/{id}': {
    get: {
      tags: ['Questions'],
      summary: 'Get a single question',
      description: 'Students receive published questions only, with hidden test cases stripped.',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        200: {
          description: 'Question detail',
          content: { 'application/json': { schema: questionResponse } },
        },
        401: unauthorizedResponse,
        404: errorResponse,
      },
    },
    put: {
      tags: ['Questions'],
      summary: 'Update a question (mentor/admin)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { type: 'object' } } },
      },
      responses: {
        200: {
          description: 'Updated question',
          content: { 'application/json': { schema: questionResponse } },
        },
        401: unauthorizedResponse,
        403: { description: 'Forbidden' },
        404: errorResponse,
        422: errorResponse,
      },
    },
    delete: {
      tags: ['Questions'],
      summary: 'Delete a question (mentor/admin)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        200: { description: 'Question deleted' },
        401: unauthorizedResponse,
        403: { description: 'Forbidden' },
        404: errorResponse,
      },
    },
  },
  '/questions/{id}/status': {
    patch: {
      tags: ['Questions'],
      summary: 'Change question status (publish / draft / archive)',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['status'],
              properties: { status: { type: 'string', enum: ['draft', 'published', 'archived'] } },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Status updated',
          content: { 'application/json': { schema: questionResponse } },
        },
        401: unauthorizedResponse,
        403: { description: 'Forbidden' },
        404: errorResponse,
      },
    },
  },
  '/questions/{id}/bookmark': {
    post: {
      tags: ['Questions'],
      summary: 'Bookmark a question',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        200: { description: 'Bookmark toggled' },
        401: unauthorizedResponse,
        404: errorResponse,
      },
    },
    delete: {
      tags: ['Questions'],
      summary: 'Remove a bookmark',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        200: { description: 'Bookmark removed' },
        401: unauthorizedResponse,
        404: errorResponse,
      },
    },
  },
  '/internal/questions/{id}': {
    get: {
      tags: ['Internal'],
      summary: 'Full question payload incl. hidden test cases (service-to-service)',
      security: [{ internalApiKey: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        200: {
          description: 'Full question detail',
          content: { 'application/json': { schema: questionResponse } },
        },
        401: unauthorizedResponse,
        404: errorResponse,
      },
    },
  },
  '/internal/questions/{id}/stats': {
    post: {
      tags: ['Internal'],
      summary: 'Record attempt/solve statistics (service-to-service)',
      security: [{ internalApiKey: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                attempted: { type: 'boolean' },
                solved: { type: 'boolean' },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Statistics recorded',
          content: { 'application/json': { schema: questionResponse } },
        },
        401: unauthorizedResponse,
        404: errorResponse,
      },
    },
  },
};
