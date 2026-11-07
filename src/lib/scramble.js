// Hover "scramble" from pxpush.com's TextAnimator: each character flickers
// through random glyphs (staggered 20ms apart) and settles back after ~100ms.
// It edits the existing text node in place, so React's DOM stays intact.

const GLYPHS = "abcdefghijklmnopqrstuvwxyz!@#$%^&*-_+=;:<>,";
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export function scramble(el) {
  const node = el?.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE || el.dataset.scrambling) return;
  if (!canHover() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const original = node.nodeValue;
  const chars = [...original];
  el.dataset.scrambling = "true";

  const render = () => {
    node.nodeValue = chars.join("");
  };

  chars.forEach((ch, i) => {
    if (ch.trim() === "") return;
    const delay = (i + 1) * 20;
    setTimeout(() => {
      chars[i] = randomGlyph();
      render();
    }, delay);
    setTimeout(() => {
      chars[i] = randomGlyph();
      render();
    }, delay + 10);
    setTimeout(() => {
      chars[i] = original[i];
      render();
    }, delay + 100);
  });

  setTimeout(() => {
    node.nodeValue = original;
    delete el.dataset.scrambling;
  }, (chars.length + 1) * 20 + 120);
}

// onPointerEnter handler: scrambles the [data-scramble] child, or the target itself.
export function scrambleOnEnter(event) {
  const target = event.currentTarget.querySelector("[data-scramble]") ?? event.currentTarget;
  scramble(target);
}
