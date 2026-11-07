// Design tokens extracted from pxpush.com (:root variables + inline styles).

export const colors = {
  bg: "#1a1a1a",
  primary: "#bababa",
  grey: "#bababa",
  black: "#111",
  red: "#ff001a",
  blue: "#03049c",
  lightblue: "#9fe4f3",
  cream: "#bab5a6",
  green: "#0f0",
  pink: "#a7849d",
  lightgrey: "#71737d",
  silver: "#d9d9d9",
  recGlow: "rgba(60, 255, 123, 0.25)",
  // Hero sky gradient and fog colour used by the three.js cloud scene.
  skyTop: "#003e6b",
  skyBottom: "#0eaebc",
};

export const fonts = {
  body: "var(--font-graphik), sans-serif",
  display: "var(--font-squeezed), sans-serif",
  mono: "var(--font-mono), monospace",
  geistMono: "var(--font-geist-mono), monospace",
};

export const breakpoints = {
  mobile: 600,
  tablet: 1300,
};

// Desktop-first, matching the original stylesheet.
export const mq = {
  tablet: `@media screen and (max-width: ${breakpoints.tablet}px)`,
  mobile: `@media screen and (max-width: ${breakpoints.mobile}px)`,
};

export const zIndex = {
  header: 21,
  scanlines: 22,
  gloom: 23,
  vignette: 100,
  noise: 100,
};

const theme = {
  colors,
  fonts,
  breakpoints,
  mq,
  zIndex,
  columns: 20,
  radius: "0.5vw",
  border: "1px solid hsla(0, 0%, 100%, 0.7)",
  borderFade: "1px solid hsla(0, 0%, 100%, 0.5)",
};

export default theme;
