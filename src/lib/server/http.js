// Small helpers shared by the route handlers.

export function json(body, status = 200) {
  return Response.json(body, {
    status,
    // Always hit the handler so loading/error states are real, not cached.
    headers: { "Cache-Control": "no-store" },
  });
}

// Optional artificial latency (API_DELAY_MS=1500 pnpm dev) to make the loading
// state visible while recording. Off unless the env var is set.
export async function maybeDelay() {
  const ms = Number(process.env.API_DELAY_MS) || 0;
  if (ms > 0) await new Promise((resolve) => setTimeout(resolve, ms));
}

// One line per request in the server log, so a failing call can be traced
// from the browser's Network tab to the terminal.
export function logRequest(method, path, status, detail) {
  const line = `[api] ${method} ${path} -> ${status}`;
  if (detail === undefined) console.info(line);
  else console.info(line, detail);
}
