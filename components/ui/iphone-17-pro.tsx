import type { SVGProps } from "react"

export interface Iphone17ProProps extends SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  src?: string
}

export function Iphone17Pro({
  width = 300,
  height = 600,
  src,
  className,
  ...props
}: Iphone17ProProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Phone Frame - Outer Shadow/Glow */}
      <rect x="5" y="5" width="290" height="590" rx="55" fill="black" />
      
      {/* Bezel / Inner Frame */}
      <rect x="10" y="10" width="280" height="580" rx="50" fill="#1a1a1a" />
      
      {/* Screen Area */}
      <rect
        id="screen"
        x="18"
        y="18"
        width="264"
        height="464"
        rx="42"
        fill="#1b1414df"
      />

      {/* Mockup Image */}
      {src && (
        <g clipPath="url(#screenClip)">
          <image
            href={src}
            x="18"
            y="19"
            width="264"
            height="560"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      )}

      {/* Status Bar Elements */}
      <g className="status-bar" fill="white">
        {/* Time */}
        <text x="54" y="50" fontFamily="sans-serif" fontSize="14" fontWeight="bold" textAnchor="middle">9:41</text>
        
        {/* Dynamic Island */}
        <rect x="110" y="34" width="80" height="22" rx="11" fill="black" />
        <circle cx="169" cy="45" r="5.5" fill="#101112ff" /> {/* Camera hole effect */}
        <circle cx="169" cy="45" r="2.5" fill="#05153eff" /> {/* Camera hole effect */}

        {/* Right side icons */}
        <g transform="translate(215, 36)">
          {/* Cellular */}
          <rect x="0" y="8" width="2.5" height="3" rx="0.5" />
          <rect x="4" y="6" width="2.5" height="5" rx="0.5" />
          <rect x="8" y="4" width="2.5" height="7" rx="0.5" />
          <rect x="12" y="2" width="2.5" height="9" rx="0.5" />
          
          {/* WiFi */}
          <path d="M18 5 C 20 3, 26 3, 28 5" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M20 7.5 C 21 6.5, 25 6.5, 26 7.5" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <circle cx="23" cy="10" r="1.2" fill="white" />

          {/* Battery */}
          <rect x="32" y="2" width="20" height="9" rx="2" stroke="white" strokeWidth="0.8" fill="none" opacity="0.6" />
          <rect x="33" y="3" width="14" height="7" rx="1" fill="white" />
          <path d="M52 4 L 52 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </g>
      </g>

      {/* Buttons */}
      <rect x="2" y="120" width="3.6" height="40" rx="1.5" fill="#201b1bff" /> {/* Silent switch */}
      <rect x="2" y="180" width="3.6" height="60" rx="1.5" fill="#201b1bff" /> {/* Volume up */}
      <rect x="2" y="250" width="3.6" height="60" rx="1.5" fill="#201b1bff" /> {/* Volume down */}
      <rect x="295" y="180" width="3.6" height="80" rx="1.5" fill="#201b1bff" /> {/* Power */}

      <rect x="110" y="572" width="80" height="4" rx="2" fill="white" fillOpacity="0.4" />

      <defs>
        <clipPath id="screenClip">
          <rect x="18" y="18" width="264" height="564" rx="42" />
        </clipPath>
      </defs>
    </svg>
  )
}
