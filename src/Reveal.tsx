import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode, MouseEventHandler } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** stagger delay in seconds (replaces transitionDelay) */
  delay?: number;
  /** horizontal entrance offset (replaces reveal-left/right) */
  x?: number;
  /** hover lift in px (replaces .card-hover translate) */
  hoverLift?: number;
  hoverShadow?: string;
  role?: string;
  "aria-label"?: string;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}

// ponytail: one wrapper replaces useReveal + .reveal* classes + .card-hover lift.
// Reduced-motion users get plain divs (plus the CSS backstop in index.css).
export function Reveal({ children, className, style, delay = 0, x = 0, hoverLift = 0, hoverShadow, ...rest }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return (<div className={className} style={style} {...rest}>{children}</div>);
  return (
    <motion.div className={className} style={style} {...rest}
      initial={{ opacity: 0, y: x === 0 ? 28 : 0, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hoverLift ? { y: -hoverLift, boxShadow: hoverShadow } : undefined}>
      {children}
    </motion.div>
  );
}
