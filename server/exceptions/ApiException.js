/**
 * Custom API Exception class to handle operational HTTP errors cleanly.
 */
class ApiException extends Error {
  constructor(message, statusCode = 500, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors = []) {
    return new ApiException(message, 400, errors);
  }

  static unauthorized(message = 'Unauthorized access') {
    return new ApiException(message, 401);
  }

  static forbidden(message = 'Forbidden: You do not have permission') {
    return new ApiException(message, 403);
  }

  static notFound(message = 'Requested resource not found') {
    return new ApiException(message, 404);
  }

  static conflict(message) {
    return new ApiException(message, 409);
  }

  static internal(message = 'Internal server error') {
    return new ApiException(message, 500);
  }
}

module.exports = ApiException;
