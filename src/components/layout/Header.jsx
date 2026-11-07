"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import styled from "@emotion/styled";
import { gsap } from "@/lib/gsap";
import { scrambleOnEnter } from "@/lib/scramble";
import Logo from "@/components/brand/Logo";
import { colors, fonts, mq, zIndex } from "@/styles/theme";

const NAV = [
  { label: "Index", href: "/" },
  { label: "About", href: "https://pxpush.com/about", external: true },
  { label: "Journal", href: "https://pxpush.com/journal", external: true },
];

const Bar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${zIndex.header};
  width: 100%;
`;

const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5vw 3vw;

  ${mq.mobile} {
    padding: 10px 20px;
  }
`;

const LogoLink = styled(Link)`
  display: block;
  width: 33%;

  svg {
    display: block;
    width: 10vw;
    height: auto;
    margin-top: 0.3vw;
  }

  ${mq.tablet} {
    svg {
      width: 115px;
      margin-top: 6px;
    }
  }

  ${mq.mobile} {
    width: auto;
    padding: 6px 0;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  width: 66%;
  font-family: ${fonts.display};

  a {
    display: block;
    padding: 0.3vw 0.7vw;
    transition: opacity 0.2s ease;
  }


  ${mq.mobile} {
    display: none;
  }
`;

const Start = styled(Link)`
  position: relative;
  padding-left: 1.4vw !important;

  &::before {
    content: "";
    position: absolute;
    top: -0.5vw;
    left: 0;
    width: 1px;
    height: 4vw;
    border-left: var(--border);
  }
`;

const Rec = styled.span`
  --rec-glow: ${colors.recGlow};
  padding: 0.3vw 0.7vw;
  color: var(--green);
  font-family: Arial, Helvetica, sans-serif;
  font-size: 130%;
  line-height: 1;
  filter: drop-shadow(0 0 0.18em var(--rec-glow));
  text-shadow: 0 0 0.15em var(--rec-glow), 0 0 0.5em var(--rec-glow), 0 0 0.25em var(--rec-glow);
`;

const MenuButton = styled.button`
  display: none;
  position: relative;
  z-index: 4;
  padding: 6px 0;
  /* original: font: inherit, i.e. the body face (Graphik), not the nav face */

  ${mq.mobile} {
    display: block;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3;
  background-color: #000c;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s linear;

  &[data-open="true"] {
    opacity: 1;
    pointer-events: auto;
  }
`;

const MobileNav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100vw;
  height: 85svh;
  padding: 20svh 0 0 10px;
  background-color: var(--blue);
  color: var(--grey);
  clip-path: inset(0 0 100% 0);
  pointer-events: none;

  &[data-open="true"] {
    pointer-events: auto;
  }

  a {
    display: block;
    padding: 5px 10px;
    font-family: ${fonts.display};
    font-size: 42px;
    line-height: 1;
  }
`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const panel = useRef(null);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!panel.current) return;
    gsap.to(panel.current, {
      clipPath: open ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
      duration: 0.6,
      ease: "expo.inOut",
    });
    // Lenis owns scrolling, so lock it through Lenis rather than body overflow.
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  const close = () => setOpen(false);

  return (
    <>
      <Bar>
        <Inner>
          <LogoLink href="/" aria-label="PX PUSH home">
            <Logo variant="header" />
          </LogoLink>

          <Nav aria-label="Main">
            {NAV.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerEnter={scrambleOnEnter}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onPointerEnter={scrambleOnEnter}
                >
                  {item.label}
                </Link>
              ),
            )}
            <Start href="/start" onPointerEnter={scrambleOnEnter}>
              Get started
            </Start>
            <Rec aria-hidden="true">●</Rec>
          </Nav>

          <MenuButton
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </MenuButton>
        </Inner>
      </Bar>

      <Backdrop data-open={open} onClick={close} />
      <MobileNav id="mobile-navigation" ref={panel} data-open={open} aria-label="Mobile">
        {NAV.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={close}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {item.label}
          </a>
        ))}
        <Link href="/start" onClick={close}>
          Get Started
        </Link>
      </MobileNav>
    </>
  );
}
