// Browser-side API client. Every failure becomes an ApiError with a `kind`, so
// the UI can tell a network problem apart from a validation or server error.
//   kind: "network"    -> request never reached the API (offline, DNS, CORS, server down)
//         "validation" -> 400, `fields` holds per-field messages
//         "server"     -> any other non-2xx response

export class ApiError extends Error {
  constructor(message, { kind, status = 0, fields = null }) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.fields = fields;
  }
}

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("Can't reach the server. Check your connection and try again.", { kind: "network" });
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON body (e.g. a proxy error page); handled by the status check below.
  }

  if (!response.ok) {
    throw new ApiError(body?.error ?? `Request failed with status ${response.status}.`, {
      kind: response.status === 400 ? "validation" : "server",
      status: response.status,
      fields: body?.fields ?? null,
    });
  }

  return body;
}

export async function fetchSection(name, { signal } = {}) {
  const body = await request(`/api/sections/${encodeURIComponent(name)}`, { signal });
  return body.items;
}

export function submitInquiry(payload) {
  return request("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
