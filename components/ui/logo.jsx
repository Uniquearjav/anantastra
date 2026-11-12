import React from 'react';

/**
 * Anantastra Vector Logo & Icon Components
 * 
 * Concept: The Anantastra Infinity Apex
 * - Letter 'A': Majestic, upward-pointing silhouette
 * - Ananta (Infinity): Dual-lobed continuous lemniscate base with 3D over-under weave
 * - Astra: Celestial precision apex and central negative space star
 * 
 * 100% Vector (SVG only), zero raster images, infinitely scalable.
 */

export function AnantastraIcon({
  size = 36,
  className = "",
  variant = "gradient", // "gradient" | "white" | "dark" | "monochrome"
  withSpark = true,
  ...props
}) {
  const isWhite = variant === "white";
  const isDark = variant === "dark" || variant === "monochrome";

  const strokeMain = isWhite 
    ? "#FFFFFF" 
    : isDark 
    ? "currentColor" 
    : "url(#ananta_react_primary)";
    
  const strokeAccent = isWhite 
    ? "rgba(255, 255, 255, 0.85)" 
    : isDark 
    ? "currentColor" 
    : "url(#ananta_react_secondary)";

  const sparkFill = isWhite 
    ? "#FFFFFF" 
    : isDark 
    ? "currentColor" 
    : "url(#ananta_react_primary)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      fill="none"
      className={`shrink-0 select-none ${className}`}
      {...props}
    >
      <defs>
        <linearGradient id="ananta_react_primary" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="32%" stopColor="#6366F1" />
          <stop offset="68%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#D946EF" />
        </linearGradient>

        <linearGradient id="ananta_react_secondary" x1="90%" y1="0%" x2="10%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="45%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        <mask id="cross_weave_react">
          <rect width="512" height="512" fill="#FFFFFF" />
          <circle cx="260" cy="336" r="34" fill="#000000" />
        </mask>
      </defs>

      <g id="anantastra-vector-mark">
        {/* Under-Ribbon: Right wing through center weave (masked at cross) */}
        <path
          d="M 256,76 
             C 256,76 388,210 388,316 
             C 388,402 330,442 276,412 
             C 240,392 216,344 186,294"
          stroke={strokeAccent}
          strokeWidth="44"
          strokeLinecap="round"
          strokeLinejoin="round"
          mask="url(#cross_weave_react)"
        />

        {/* Over-Ribbon: Left flank, apex, and over-crossbar */}
        <path
          d="M 326,294 
             C 296,344 272,392 236,412 
             C 182,442 124,402 124,316 
             C 124,210 256,76 256,76"
          stroke={strokeMain}
          strokeWidth="44"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Apex Precision Crown */}
        <path
          d="M 242,94 L 256,66 L 270,94 Z"
          fill={strokeMain}
          strokeLinejoin="round"
        />

        {/* Astra Spark */}
        {withSpark && (
          <path
            d="M 256,176 L 264,204 L 292,212 L 264,220 L 256,248 L 248,220 L 220,212 L 248,204 Z"
            fill={sparkFill}
            opacity="0.95"
          />
        )}
      </g>
    </svg>
  );
}

/**
 * Full Brand Lockup with Vector Icon + Modern Typography
 */
export function AnantastraLockup({
  iconSize = 36,
  className = "",
  showTagline = true,
  tagline = "Infinite Tools",
  ...props
}) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`} {...props}>
      <AnantastraIcon size={iconSize} />
      <div className="flex flex-col leading-none">
        <span className="font-extrabold tracking-wider text-foreground text-lg uppercase font-sans">
          Anantastra
        </span>
        {showTagline && (
          <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase mt-0.5">
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
}

export default AnantastraIcon;
