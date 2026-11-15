const MOCK_LATENCY_MS = 400;

/** Simulates an API call so components see the same async behavior as with the real backend. */
export function mockResponse<T>(data: T, latencyMs = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), latencyMs));
}

/** Simulates a failed API call (e.g. 404) after the same latency. */
export function mockError(error: Error, latencyMs = MOCK_LATENCY_MS): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(error), latencyMs));
}
