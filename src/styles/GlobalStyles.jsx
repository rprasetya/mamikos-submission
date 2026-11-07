"use client";

import { Global, css } from "@emotion/react";
import { colors, fonts, mq } from "./theme";

// Base layer ported from pxpush.com's global stylesheet.
const styles = css`
  :root {
    --bgcolor: ${colors.bg};
    --primarycolor: ${colors.primary};
    --red: ${colors.red};
    --grey: ${colors.grey};
    --black: ${colors.black};
    --lightblue: ${colors.lightblue};
    --blue: ${colors.blue};
    --cream: ${colors.cream};
    --green: ${colors.green};
    --pink: ${colors.pink};
    --lightgrey: ${colors.lightgrey};
    --columns: 20;
    --bannerHeight: 170vh;
    --radius: 0.5vw;
    --border: 1px solid hsla(0, 0%, 100%, 0.7);
    --borderFade: 1px solid hsla(0, 0%, 100%, 0.5);
  }

  ${mq.mobile} {
    :root {
      --bannerHeight: 100lvh;
      --radius: 1vh;
    }
  }

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: var(--bgcolor);
    color: var(--primarycolor);
    font-family: ${fonts.body};
    font-size: 1.7vw;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  ${mq.tablet} {
    body {
      font-size: 20px;
    }
  }

  main {
    min-height: 100dvh;
    width: 100%;
  }

  a {
    color: inherit;
    cursor: pointer;
    font-weight: inherit;
    outline: 0;
    text-decoration: none;
  }

  button {
    font: inherit;
    color: inherit;
    background: transparent;
    border: 0;
    cursor: pointer;
  }

  img,
  video,
  canvas {
    display: block;
    max-width: 100%;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: ${fonts.display};
    font-weight: 400;
  }

  h1 {
    font-size: 6vw;
    line-height: 0.9;
  }
  h2 {
    font-size: 12.5vw;
    letter-spacing: -0.5vw;
    line-height: 1;
  }
  h3 {
    font-size: 8vw;
    letter-spacing: -0.1vw;
    line-height: 0.95;
  }
  h4 {
    font-size: 6vw;
    line-height: 0.85;
  }
  h5 {
    font-size: 3vw;
    line-height: 0.95;
  }

  ${mq.tablet} {
    h1 {
      font-size: 62px;
    }
  }

  ${mq.mobile} {
    h1 {
      font-size: 40px;
    }
    h2 {
      font-size: 20vw;
    }
    h3 {
      font-size: 15vw;
    }
    h4 {
      font-size: 10vw;
    }
    h5 {
      font-size: 10vw;
    }
  }

  small {
    font-size: 50%;
    letter-spacing: 0;
  }
`;

export default function GlobalStyles() {
  return <Global styles={styles} />;
}
