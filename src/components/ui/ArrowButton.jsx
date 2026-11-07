"use client";

import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { scrambleOnEnter } from "@/lib/scramble";
import { fonts, mq } from "@/styles/theme";

// .button.button__big / .button__half with the fill-on-hover bar and "↗" arrow.
// Colours come from the surrounding section's --color/--background variables;
// `fill`, `ink`, `hoverInk` override them for the pricing/branding variants.

const sizes = {
  big: css`
    width: 100%;
    padding: 1vw 0;
    &:first-of-type {
      border-top: 1px solid var(--btn-line);
    }
    ${mq.mobile} {
      padding: 10px 0;
    }
  `,
  half: css`
    width: 48%;
    padding: 0.5vw 0;
    &:nth-of-type(-n + 2) {
      border-top: 1px solid var(--btn-line);
    }
    ${mq.mobile} {
      width: 100%;
      &:nth-of-type(2) {
        border-top: none;
      }
    }
  `,
};

// `size` is styling-only; keep it off the DOM even when rendered `as={Link}`.
// `as` must also return false here, otherwise Emotion forwards it to the DOM
// instead of using it to swap the element.
const Root = styled("a", { shouldForwardProp: (prop) => prop !== "size" && prop !== "as" })`
  --btn-line: var(--color);
  position: relative;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--btn-line);
  color: var(--btn-ink, var(--color));
  background-color: var(--btn-bg, transparent);
  font-family: ${fonts.mono};
  font-size: 70%;
  letter-spacing: -0.05vw;
  ${(p) => sizes[p.size]}

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: calc(100% + 3px);
    background-color: var(--btn-fill, var(--color));
    transform: scaleY(0);
    /* leave: retract toward the top (power2.inOut, 0.1s) */
    transform-origin: 50% 0%;
    transition: transform 0.1s cubic-bezier(0.45, 0, 0.55, 1);
  }

  & > span {
    position: relative;
    transition: padding 0.3s ease;
  }

  @media (hover: hover) {
    &:hover {
      color: var(--btn-hover-ink, var(--bgcolor));
    }
    /* enter: rise from the bottom (power2.out, 0.2s) */
    &:hover::before {
      transform: scaleY(1);
      transform-origin: 50% 100%;
      transition: transform 0.2s cubic-bezier(0.5, 1, 0.89, 1);
    }
    &:hover > span {
      padding: 0 1vw;
    }
  }

  &:focus-visible {
    outline: 1px solid currentColor;
    outline-offset: 2px;
  }
`;

const Arrow = styled.span`
  display: inline-block;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 150%;
  line-height: 1;
  margin-right: 0.5vw;
  top: 0.05vw;
`;

export default function ArrowButton({ href, children, size = "big", external = false, ...rest }) {
  const isInternal = !external && href?.startsWith("/");
  const linkProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};

  return (
    <Root
      as={isInternal ? Link : "a"}
      href={href}
      size={size}
      onPointerEnter={scrambleOnEnter}
      {...linkProps}
      {...rest}
    >
      <span data-scramble>{children}</span>
      <Arrow aria-hidden="true">↗</Arrow>
    </Root>
  );
}
