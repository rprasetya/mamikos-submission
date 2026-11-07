import localFont from "next/font/local";

// Font files taken from pxpush.com. Each font exposes a CSS variable that
// theme.js references, so components never hardcode font family names.

export const graphik = localFont({
  src: [
    { path: "../assets/fonts/Graphik-Extralight-Web.woff2", weight: "200", style: "normal" },
    { path: "../assets/fonts/Graphik-Regular-Web.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-graphik",
  display: "swap",
});

// Display face used for every heading and lead paragraph.
export const semiSqueezed = localFont({
  src: "../assets/fonts/SemiSqueezedMedium.woff2",
  weight: "400",
  variable: "--font-squeezed",
  display: "swap",
});

// The original site registers this one as font-family "Mono".
export const neueMontrealMono = localFont({
  src: "../assets/fonts/PPNeueMontrealMono-Book.woff2",
  weight: "400",
  variable: "--font-mono",
  display: "swap",
});

export const geistMono = localFont({
  src: "../assets/fonts/GeistMono-Regular.woff2",
  weight: "400",
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontVariables = [graphik, semiSqueezed, neueMontrealMono, geistMono]
  .map((font) => font.variable)
  .join(" ");
