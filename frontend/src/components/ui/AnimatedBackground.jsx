import React from 'react'
import { motion } from 'framer-motion'
import { Rupee3DSvg } from './Rupee3DSvg'

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* 1. Base Gradient Canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/90" />

      {/* 2. Animated Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/30 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 50, -40, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-amber-500/20 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 40, -40, 0],
          y: [0, 40, -50, 0],
          scale: [0.9, 1.25, 1, 0.9],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute bottom-10 left-1/4 w-[32rem] h-[32rem] rounded-full bg-emerald-500/20 blur-3xl"
      />

      {/* 3. Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
          backgroundSize: '36px 36px',
        }}
      />

      {/* 4. Floating 3D Rupee SVGs & Coins in the Background */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          rotate: [0, 15, -15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-24 left-[8%] opacity-35 hidden md:block"
      >
        <Rupee3DSvg size={72} variant="gold" animate={false} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -12, 12, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 right-[7%] opacity-35 hidden md:block"
      >
        <Rupee3DSvg size={84} variant="emerald" animate={false} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, -18, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-32 left-[12%] opacity-30 hidden md:block"
      >
        <Rupee3DSvg size={60} variant="indigo" animate={false} />
      </motion.div>

      {/* Glow highlight line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
    </div>
  )
}
