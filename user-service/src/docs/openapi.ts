/**
 * OpenAPI component & path definitions for the User Service.
 * Referenced by swagger/index.ts (swagger-jsdoc).
 */

export const openapiComponents = {
  schemas: {
    ErrorResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string' },
        errors: { type: 'array', items: { type: 'object' } },
      },
    },
    Success: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string' },
        data: {},
      },
    },
    SocialLinks: {
      type: 'object',
      properties: {
        github: { type: 'string', nullable: true },
        linkedin: { type: 'string', nullable: true },
        portfolio: { type: 'string', nullable: true },
        leetcode: { type: 'string', nullable: true },
        codeforces: { type: 'string', nullable: true },
        hackerrank: { type: 'string', nullable: true },
      },
    },
    Skill: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
      },
    },
    Education: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        college: { type: 'string' },
        branch: { type: 'string', nullable: true },
        degree: { type: 'string', nullable: true },
        startYear: { type: 'integer', nullable: true },
        endYear: { type: 'integer', nullable: true },
      },
    },
    Experience: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        company: { type: 'string' },
        designation: { type: 'string', nullable: true },
        startDate: { type: 'string', format: 'date', nullable: true },
        endDate: { type: 'string', format: 'date', nullable: true },
        description: { type: 'string', nullable: true },
      },
    },
    User: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        authUserId: { type: 'string', format: 'uuid' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string', nullable: true },
        avatarUrl: { type: 'string', nullable: true },
        bio: { type: 'string', nullable: true },
        gender: {
          type: 'string',
          enum: ['male', 'female', 'other', 'prefer_not_to_say'],
          nullable: true,
        },
        dateOfBirth: { type: 'string', format: 'date', nullable: true },
        role: { type: 'string', enum: ['student', 'mentor', 'admin'] },
        collegeId: { type: 'string', format: 'uuid', nullable: true },
        branchId: { type: 'string', format: 'uuid', nullable: true },
        batchId: { type: 'string', format: 'uuid', nullable: true },
        profileCompletion: { type: 'integer', example: 72 },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        socialLinks: { $ref: '#/components/schemas/SocialLinks' },
        skills: { type: 'array', items: { $ref: '#/components/schemas/Skill' } },
        education: { type: 'array', items: { $ref: '#/components/schemas/Education' } },
        experience: { type: 'array', items: { $ref: '#/components/schemas/Experience' } },
      },
    },
    PaginatedUsers: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/User' } },
        pagination: {
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
      },
    },
    Statistics: {
      type: 'object',
      properties: {
        total: { type: 'integer' },
        students: { type: 'integer' },
        mentors: { type: 'integer' },
        admins: { type: 'integer' },
        active: { type: 'integer' },
        inactive: { type: 'integer' },
      },
    },
  },
};

export const openapiPaths = {
  '/health': {
    get: {
      summary: 'Health check',
      tags: ['System'],
      security: [],
      responses: {
        200: {
          description: 'Service is healthy',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Success' } } },
        },
      },
    },
  },
  '/users/me': {
    get: {
      summary: 'Get own profile',
      tags: ['Profile'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
        },
      },
    },
    put: {
      summary: 'Update own profile',
      tags: ['Profile'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string', nullable: true },
                bio: { type: 'string', nullable: true },
                gender: {
                  type: 'string',
                  enum: ['male', 'female', 'other', 'prefer_not_to_say'],
                  nullable: true,
                },
                dateOfBirth: { type: 'string', format: 'date', nullable: true },
                collegeId: { type: 'string', format: 'uuid', nullable: true },
                branchId: { type: 'string', format: 'uuid', nullable: true },
                batchId: { type: 'string', format: 'uuid', nullable: true },
                socialLinks: { $ref: '#/components/schemas/SocialLinks' },
                skills: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      level: {
                        type: 'string',
                        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
                      },
                    },
                  },
                },
                education: { type: 'array', items: { $ref: '#/components/schemas/Education' } },
                experience: { type: 'array', items: { $ref: '#/components/schemas/Experience' } },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Updated',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
        },
      },
    },
  },
  '/users/avatar': {
    post: {
      summary: 'Upload avatar (multipart/form-data, field "avatar")',
      tags: ['Profile'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: { avatar: { type: 'string', format: 'binary' } },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Uploaded',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
        },
      },
    },
    delete: {
      summary: 'Remove avatar',
      tags: ['Profile'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Removed',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
        },
      },
    },
  },
  '/users/search': {
    get: {
      summary: 'Search & filter users',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'q', schema: { type: 'string' } },
        {
          in: 'query',
          name: 'role',
          schema: { type: 'string', enum: ['student', 'mentor', 'admin'] },
        },
        { in: 'query', name: 'collegeId', schema: { type: 'string', format: 'uuid' } },
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
      ],
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PaginatedUsers' } },
          },
        },
      },
    },
  },
  '/users/statistics': {
    get: {
      summary: 'User statistics (admin)',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Statistics' } } },
        },
      },
    },
  },
  '/users': {
    get: {
      summary: 'List users (paginated)',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'query', name: 'page', schema: { type: 'integer', default: 1 } },
        { in: 'query', name: 'limit', schema: { type: 'integer', default: 20 } },
        {
          in: 'query',
          name: 'role',
          schema: { type: 'string', enum: ['student', 'mentor', 'admin'] },
        },
      ],
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/PaginatedUsers' } },
          },
        },
      },
    },
  },
  '/users/{id}': {
    get: {
      summary: 'Get a user by internal id',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        200: {
          description: 'OK',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
        },
      },
    },
    delete: {
      summary: 'Delete a user (admin)',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        200: {
          description: 'Deleted',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Success' } } },
        },
      },
    },
  },
  '/users/{id}/status': {
    patch: {
      summary: 'Activate / deactivate (block) a user (admin)',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: { type: 'object', properties: { isActive: { type: 'boolean' } } },
          },
        },
      },
      responses: {
        200: {
          description: 'Updated',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
        },
      },
    },
  },
  '/users/{id}/role': {
    patch: {
      summary: 'Update a user role (admin)',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      parameters: [
        { in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { role: { type: 'string', enum: ['student', 'mentor', 'admin'] } },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Updated',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
        },
      },
    },
  },
};
