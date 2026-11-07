"use client";

import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { fonts, mq } from "@/styles/theme";

// Layout and typography building blocks ported from pxpush.com's stylesheet
// (.section, .layout, .layout__third/second/half, .lead, .monospace).

const TONES = {
  grey: css`
    --background: var(--bgcolor);
  `,
  lightgrey: css`
    --background: var(--lightgrey);
    --color: var(--black);
  `,
  blue: css`
    --background: var(--blue);
    --color: var(--grey);
  `,
  black: css`
    --background: var(--black);
    --color: var(--grey);
  `,
};

const PADDING = {
  default: css`
    padding: 5vw 0 10vw;
    ${mq.mobile} {
      padding: 30px 0 60px;
    }
  `,
  none: css`
    padding: 0;
  `,
  // .no__pt: a hairline top padding, normal bottom padding
  noTop: css`
    padding: 0.3vw 0 10vw;
    ${mq.mobile} {
      padding: 0.3vw 0 60px;
    }
  `,
  // .no__pt.no__pb
  flush: css`
    padding: 0.3vw 0 0;
  `,
};

export const Section = styled.section`
  --color: var(--primarycolor);
  position: relative;
  background-color: var(--background);
  color: var(--color);
  ${(p) => TONES[p.tone ?? "grey"]}
  ${(p) => PADDING[p.space ?? "default"]}
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  padding: 1.5vw 3vw;

  ${mq.mobile} {
    display: block;
    padding: 10px 20px;
  }
`;

export const Third = styled.div`
  width: 33%;
  ${mq.mobile} {
    width: 100%;
  }
`;

export const Second = styled.div`
  width: 66%;
  ${mq.mobile} {
    width: 100%;
  }
`;

export const Half = styled.div`
  width: 50%;
  ${mq.mobile} {
    width: 100%;
  }
`;

const monoBase = css`
  font-family: ${fonts.mono};
  font-weight: 400;
  font-size: 50%;
  letter-spacing: -0.05vw;
  text-transform: uppercase;
`;

// .monospace (uppercase label) or .monospace.monospace__p (sentence case copy)
export const Mono = styled.div`
  ${monoBase}
  ${(p) =>
    p.copy &&
    css`
      font-size: 70%;
      text-transform: none;
    `}
  ${(p) =>
    p.dim &&
    css`
      opacity: 0.5;
    `}
`;

// .layout__third.monospace: the column label with a "⬤" bullet.
export const Label = styled(Third)`
  ${monoBase}
  position: relative;
  padding-left: 3vw;
  padding-top: 0.8vw;
  white-space: pre-line;
  ${(p) =>
    p.dim &&
    css`
      opacity: 0.5;
    `}

  &::before {
    content: ${(p) => (p.bullet === false ? '""' : '"⬤"')};
    position: absolute;
    left: 0;
    top: 0.8vw;
  }

  ${mq.mobile} {
    padding-left: 0;
    padding-bottom: 40px;
    &::before {
      content: "";
    }
  }
`;

// p.lead, optionally with the "→" indent used on the first paragraph of a block.
export const Lead = styled.p`
  font-family: ${fonts.display};
  font-size: 2.8vw;
  line-height: 1;
  margin-bottom: ${(p) => (p.last ? "8vw" : "4vw")};

  ${(p) =>
    p.indent &&
    css`
      --lead-indent: 20vw;
      position: relative;
      text-indent: var(--lead-indent);

      &::before {
        content: "→";
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0.5;
        text-indent: 0;
      }

      /* text-indent is inherited: keep split word boxes from indenting themselves */
      .word,
      .line {
        text-indent: 0;
      }

      ${mq.mobile} {
        --lead-indent: 40vw;
      }
    `}

  ${mq.mobile} {
    font-size: 30px;
    margin-bottom: ${(p) => (p.last ? "60px" : "30px")};
  }
`;

export const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;
