"use client";

import { ThemeProvider } from "@emotion/react";
import theme from "@/styles/theme";
import GlobalStyles from "@/styles/GlobalStyles";
import EmotionRegistry from "./EmotionRegistry";
import SmoothScroll from "./SmoothScroll";

export default function AppProviders({ children }) {
  return (
    <EmotionRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <SmoothScroll>{children}</SmoothScroll>
      </ThemeProvider>
    </EmotionRegistry>
  );
}
