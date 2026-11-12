'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  depth?: number; // max tilt angle in degrees, default 14
  glare?: boolean;
}

export function Card3D({
  children,
  className,
  depth = 12,
  glare = true,
  ...props
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinates from -0.5 to +0.5 relative to card center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for buttery smooth 3D motion
  const springConfig = { damping: 20, stiffness: 220, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [depth, -depth]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-depth, depth]), springConfig);

  // Glare position
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 w-full"
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={cn(
          'relative rounded-3xl transition-shadow duration-300',
          className
        )}
      >
        {children}

        {/* 3D Specular Golden Glare Beam */}
        {glare && (
          <motion.div
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(251, 191, 36, 0.22) 0%, rgba(245, 158, 11, 0.08) 35%, transparent 70%)`,
            }}
            className="pointer-events-none absolute inset-0 z-30 rounded-3xl transition-opacity duration-300 mix-blend-overlay"
          />
        )}
      </motion.div>
    </div>
  );
}

export function Card3DItem({
  children,
  className,
  translateZ = 30,
}: {
  children: React.ReactNode;
  className?: string;
  translateZ?: number;
}) {
  return (
    <div
      style={{
        transform: `translateZ(${translateZ}px)`,
        transformStyle: 'preserve-3d',
      }}
      className={cn('transition-transform duration-200', className)}
    >
      {children}
    </div>
  );
}
