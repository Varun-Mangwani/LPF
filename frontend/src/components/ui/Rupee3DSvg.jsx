import React from 'react'
import { motion } from 'framer-motion'

export function Rupee3DSvg({ size = 64, variant = 'gold', className = '', animate = true }) {
  const gradientIds = {
    gold: {
      face: 'gold-face-grad',
      bevel: 'gold-bevel-grad',
      edge: 'gold-edge-grad',
    },
    emerald: {
      face: 'emerald-face-grad',
      bevel: 'emerald-bevel-grad',
      edge: 'emerald-edge-grad',
    },
    indigo: {
      face: 'indigo-face-grad',
      bevel: 'indigo-bevel-grad',
      edge: 'indigo-edge-grad',
    },
  }

  const g = gradientIds[variant] || gradientIds.gold

  const svgContent = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-xl ${className}`}
    >
      <defs>
        {/* Gold Gradients */}
        <linearGradient id="gold-face-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE259" />
          <stop offset="50%" stopColor="#FFA751" />
          <stop offset="100%" stopColor="#B76E00" />
        </linearGradient>
        <linearGradient id="gold-bevel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF5C0" />
          <stop offset="100%" stopColor="#8C5000" />
        </linearGradient>
        <linearGradient id="gold-edge-grad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* Emerald Gradients */}
        <linearGradient id="emerald-face-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        <linearGradient id="emerald-bevel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
        <linearGradient id="emerald-edge-grad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#022C22" />
        </linearGradient>

        {/* Indigo Gradients */}
        <linearGradient id="indigo-face-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <linearGradient id="indigo-bevel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C7D2FE" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
        <linearGradient id="indigo-edge-grad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>

        {/* 3D Drop Shadow Filter */}
        <filter id="shadow-3d" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="6" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* 3D Outer Coin Base */}
      <circle cx="50" cy="53" r="44" fill={`url(#${g.edge})`} />
      <circle cx="50" cy="50" r="44" fill={`url(#${g.bevel})`} filter="url(#shadow-3d)" />
      <circle cx="50" cy="50" r="39" fill={`url(#${g.face})`} />
      <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 2" />

      {/* 3D Rupee (₹) Symbol path with bevel extrusion */}
      <g filter="url(#shadow-3d)">
        {/* Extruded shadow layer */}
        <path
          d="M34 29 H66 M34 39 H66 M34 29 V50 C44 50 54 48 54 39 M34 49 L58 71"
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="translate(1, 2)"
        />
        {/* Main highlight layer */}
        <path
          d="M34 29 H66 M34 39 H66 M34 29 V50 C44 50 54 48 54 39 M34 49 L58 71"
          stroke="#FFFFFF"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34 29 H66 M34 39 H66 M34 29 V50 C44 50 54 48 54 39 M34 49 L58 71"
          stroke={`url(#${g.edge})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )

  if (!animate) return svgContent

  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [0, 3, -3, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
      className="inline-block"
    >
      {svgContent}
    </motion.div>
  )
}
