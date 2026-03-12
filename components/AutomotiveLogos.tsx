import React from "react";

/**
 * High-quality, transparent SVG path data for automotive brands.
 * These are hand-crafted to be clean, responsive, and professional.
 */

export const BMWLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <circle cx="12" cy="12" r="11" fill="white" />
    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" fill="none" />
    <path d="M12 2a10 10 0 0 1 10 10h-10z" fill="#0066ad" />
    <path d="M12 22a10 10 0 0 1-10-10h10z" fill="#0066ad" />
    <circle cx="12" cy="12" r="6" fill="none" stroke="black" strokeWidth="0.5" />
    <text x="12" y="6.5" fontSize="2.5" fontWeight="black" textAnchor="middle" fill="black" style={{ fontFamily: 'Arial, sans-serif' }}>B</text>
    <text x="17.5" y="13" fontSize="2.5" fontWeight="black" textAnchor="middle" fill="black" style={{ fontFamily: 'Arial, sans-serif' }}>M</text>
    <text x="12" y="19" fontSize="2.5" fontWeight="black" textAnchor="middle" fill="black" style={{ fontFamily: 'Arial, sans-serif' }}>W</text>
  </svg>
);

export const MercedesLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    <path d="M12 4.5l2 6.5h6.5l-5.5 4 2 6.5-5-4-5 4 2-6.5-5.5-4h6.5z" />
  </svg>
);

export const LamborghiniLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" fill="#d4af37" />
    <path d="M12 4l-6 2.25v4.75c0 4.16 2.88 8.05 6 9 3.12-.95 6-4.84 6-9V6.25L12 4z" fill="black" />
    <path d="M12 8c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5S13.5 8 12 8zm0 4c-.83 0-1.5-.67-1.5-1.5S11.17 9 12 9s1.5.67 1.5 1.5S12.83 12 12 12z" fill="#d4af37" />
  </svg>
);

export const FerrariLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect width="16" height="22" x="4" y="1" rx="2" fill="#ff2800" />
    <path d="M12 5c-1 0-2 1-2 2s1 2 2 2 2-1 2-2-1-2-2-2zm0 14c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z" fill="black" />
    <path d="M10 10l4 4m0-4l-4 4" stroke="black" strokeWidth="2" />
  </svg>
);

export const PorscheLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" fill="#8b0000" />
    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0" fill="#ffd700" />
    <path d="M12 12l-2-2m4 4l-2-2m0 0l2-2m-4 4l2-2" stroke="black" strokeWidth="1" />
  </svg>
);

export const MGLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 12l4-4h8l4 4-4 4H8l-4-4z" />
    <path d="M8 12h8" />
  </svg>
);
