/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // SWC port of @emotion/babel-plugin: readable class labels in dev + source maps.
  compiler: {
    emotion: true,
  },
  // Turbopack is the default bundler for `next dev` and `next build` in Next 16.
  // cacheComponents is left off on purpose: the API route keeps in-memory data,
  // so route handlers should stay dynamic instead of being prerendered at build.
};

export default nextConfig;
