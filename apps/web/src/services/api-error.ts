/**
 * Error thrown by the service layer when a request fails.
 * Mock services throw it today; the real API client will throw the same error
 * with the HTTP status of the response, so components don't change.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}
