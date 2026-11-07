// In-memory storage for inquiries. Data lives only as long as the server
// process: it resets on every restart, redeploy and Vercel cold start, and each
// serverless instance has its own copy. That is acceptable for this test.

// Kept on globalThis so Turbopack hot reloads in dev don't wipe it.
const store = (globalThis.__pxInquiries ??= []);

export function addInquiry(data) {
  const inquiry = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  store.push(inquiry);
  return { inquiry, position: store.length };
}
