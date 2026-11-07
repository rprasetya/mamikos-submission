import "lenis/dist/lenis.css";
import AppProviders from "@/components/providers/AppProviders";
import CrtScreen from "@/components/effects/CrtScreen";
import { fontVariables } from "@/styles/fonts";

// Vercel exposes the production domain at build time; fall back to local dev.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "PX PUSH — Design subscription service",
  description: "The best design subscription service for agencies, startups, and entrepreneurs.",
  icons: { icon: "/favicon.png" },
  openGraph: { images: ["/img/og/index.jpg"] },
  // This is a clone for a technical test; keep it out of search results.
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: "#1a1a1a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <AppProviders>
          <CrtScreen />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
