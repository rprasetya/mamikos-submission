import { FOOTER_LOGO, HEADER_LOGO } from "./logoPaths";

const LOGOS = { header: HEADER_LOGO, footer: FOOTER_LOGO };

// PX PUSH wordmark. Paths use currentColor, so colour comes from CSS.
export default function Logo({ variant = "header", title = "PX PUSH", ...rest }) {
  const { viewBox, paths } = LOGOS[variant];
  return (
    <svg viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title} {...rest}>
      {paths.map((d) => (
        <path key={d.slice(0, 24)} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}
