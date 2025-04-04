export class ApiError {
  code: string;
  message: string;
  errors?: Record<string, string[]>;
  metadata?: Record<string, any>;

  constructor(
    code: string,
    message: string,
    errors?: Record<string, string[]>,
    metadata?: Record<string, any>
  ) {
    this.code = code;
    this.message = message;
    this.errors = errors;
    this.metadata = metadata;
  }
}
