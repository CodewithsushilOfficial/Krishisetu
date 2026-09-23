export class ApiError extends Error {
  constructor(message, statusCode = 500, code = 'API_ERROR', details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request', code = 'BAD_REQUEST', details = null) {
    super(message, 400, code, details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized access', code = 'UNAUTHORIZED', details = null) {
    super(message, 401, code, details);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden access', code = 'FORBIDDEN', details = null) {
    super(message, 403, code, details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND', details = null) {
    super(message, 404, code, details);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Resource conflict', code = 'CONFLICT', details = null) {
    super(message, 409, code, details);
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}
