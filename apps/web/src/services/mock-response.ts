const MOCK_LATENCY_MS = 400;

/** Simulates an API call so components see the same async behavior as with the real backend. */
export function mockResponse<T>(data: T, latencyMs = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), latencyMs));
}
