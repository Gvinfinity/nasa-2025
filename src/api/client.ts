const BASE_URL = import.meta.env.VITE_API_URL; // e.g. "https://api.example.com"

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL || ""}${endpoint}`;

  // Debug outgoing request
  try {
    const method = (options.method || "GET").toUpperCase();
    const bodyPreview = options.body ? options.body : undefined;
    console.log(`[api] ${method} ${url}`, bodyPreview);
  } catch {
    // ignore logging failures
  }

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    // try to read response as JSON for structured errors, fall back to text
  let errorBody: unknown = null;
    try {
      const text = await response.text();
      try {
        errorBody = JSON.parse(text);
      } catch {
        errorBody = text;
      }
    } catch (e) {
      errorBody = `<failed to read response body: ${e}>`;
    }

    console.error(`[api] HTTP ${response.status} ${url}`, errorBody);
    throw new Error(`HTTP ${response.status}: ${typeof errorBody === 'string' ? errorBody : JSON.stringify(errorBody)}`);
  }

  // attempt to parse JSON, otherwise return text
  try {
    return await response.json();
  } catch {
    const text = await response.text();
    // @ts-expect-error returning string instead of generic
    return text;
  }
}

export const apiClient = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: "PUT", body: JSON.stringify(body) }),
  del: <T>(endpoint: string) =>
    request<T>(endpoint, { method: "DELETE" }),
};
