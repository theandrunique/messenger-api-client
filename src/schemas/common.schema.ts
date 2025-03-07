export class ApiError {
  code: string;
  message: string;
  errors?: Record<string, string[]>;

  constructor(
    code: string,
    message: string,
    errors?: Record<string, string[]>
  ) {
    this.code = code;
    this.message = message;
    this.errors = errors;
  }
}
