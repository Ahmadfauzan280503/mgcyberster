"use client"

import type { HTMLAttributes } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

const PHONE_WIDTH = 433
const PHONE_HEIGHT = 882
const SCREEN_X = 21.25
const SCREEN_Y = 19.25
const SCREEN_WIDTH = 389.5
const SCREEN_HEIGHT = 843.5
const SCREEN_RADIUS = 55.75

// Calculated percentages
const LEFT_PCT = (SCREEN_X / PHONE_WIDTH) * 100
const TOP_PCT = (SCREEN_Y / PHONE_HEIGHT) * 100
const WIDTH_PCT = (SCREEN_WIDTH / PHONE_WIDTH) * 100
const HEIGHT_PCT = (SCREEN_HEIGHT / PHONE_HEIGHT) * 100
const RADIUS_H = (SCREEN_RADIUS / SCREEN_WIDTH) * 100
const RADIUS_V = (SCREEN_RADIUS / SCREEN_HEIGHT) * 100

export interface IphoneProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  videoSrc?: string
}

export function Iphone({
  src,
  videoSrc,
  className,
  style,
}: IphoneProps) {
  const hasVideo = !!videoSrc
  
  // 3D Tilt Logic
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      className={className}
      style={{
        perspective: "1200px",
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative inline-block w-full align-middle leading-none group"
        style={{
          aspectRatio: `${PHONE_WIDTH}/${PHONE_HEIGHT}`,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Realistic Hardware Frame */}
        <svg
          viewBox={`0 0 ${PHONE_WIDTH} ${PHONE_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 size-full transition-transform duration-500"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Main Body / Titanium Frame */}
          <path
            d="M60 4C30 4 4 30 4 60V822C4 852 30 878 60 878H373C403 878 429 852 429 822V60C429 30 403 4 373 4H60Z"
            className="fill-[#2a2a2a] dark:fill-[#121212]"
          />
          
          {/* Bezel Detail (Inner Frame) */}
          <path
            d="M60 7C32 7 7 32 7 60V822C7 850 32 875 60 875H373C401 875 426 850 426 822V60C426 32 401 7 373 7H60Z"
            className="fill-zinc-900 dark:fill-[#080808]"
          />

          {/* Side Buttons (Left) */}
          <rect x="0" y="170" width="4" height="35" rx="1" className="fill-[#1a1a1a] dark:fill-[#050505]" /> {/* Action/Mute */}
          <rect x="0" y="235" width="4" height="65" rx="1" className="fill-[#1a1a1a] dark:fill-[#050505]" /> {/* Vol Up */}
          <rect x="0" y="320" width="4" height="65" rx="1" className="fill-[#1a1a1a] dark:fill-[#050505]" /> {/* Vol Down */}
          
          {/* Side Buttons (Right) */}
          <rect x="429" y="280" width="4" height="100" rx="1" className="fill-[#1a1a1a] dark:fill-[#050505]" /> {/* Power */}

          {/* Antenna Lines */}
          <rect x="60" y="4" width="2" height="6" className="fill-zinc-700/50" />
          <rect x="371" y="4" width="2" height="6" className="fill-zinc-700/50" />
          <rect x="60" y="872" width="2" height="6" className="fill-zinc-700/50" />
          <rect x="371" y="872" width="2" height="6" className="fill-zinc-700/50" />

          {/* Main Display Area (Bezel) */}
          <path
            d={`M${SCREEN_X} 75C${SCREEN_X} 44.2 46.2 ${SCREEN_Y} 77 ${SCREEN_Y}H355C385.8 ${SCREEN_Y} 410.8 44.2 410.8 75V807C410.8 837.8 385.8 862.8 355 862.8H77C46.2 862.8 ${SCREEN_X} 837.8 ${SCREEN_X} 807V75Z`}
            className="fill-black stroke-zinc-800 dark:stroke-zinc-900 stroke-[4]"
          />
        </svg>

        {/* Screen Content Wrapper */}
        <div
          className="pointer-events-none absolute overflow-hidden shadow-inner"
          style={{
            left: `${LEFT_PCT}%`,
            top: `${TOP_PCT}%`,
            width: `${WIDTH_PCT}%`,
            height: `${HEIGHT_PCT}%`,
            borderRadius: `${RADIUS_H}% / ${RADIUS_V}%`,
            transform: "translateZ(10px)",
          }}
        >
          {hasVideo && (
            <video
              className="block size-full object-cover"
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          )}

          {!hasVideo && src && (
            <img
              src={src}
              alt=""
              className="block size-full object-cover object-top filter contrast-[1.05] brightness-[0.95]"
            />
          )}
          
          {/* Subtle Screen Glare */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
        </div>

        {/* Dynamic Island Overlay */}
        <div
          className="absolute z-30 pointer-events-none bg-black rounded-[22px] shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          style={{
            left: "50%",
            top: "40px",
            width: "120px",
            height: "36px",
            marginLeft: "-60px",
            transform: "translateZ(25px)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div className="absolute right-[20%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#1a1a1a] shadow-inner border border-white/5 opacity-40" /> {/* Camera hole effect */}
        </div>

        {/* Outer Shine/Reflection Layer */}
        <motion.div
          className="absolute inset-0 z-40 pointer-events-none rounded-[60px]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.05) 100%)",
            transform: "translateZ(30px)",
            boxShadow: "inset 0 0 20px rgba(255,255,255,0.05)",
          }}
        />
      </motion.div>
    </div>
  )
}
