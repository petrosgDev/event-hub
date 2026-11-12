'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Ticket, Award, Zap } from 'lucide-react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
}

export function Hero3DScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || 500);
    let height = (canvas.height = canvas.offsetHeight || 500);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 500;
      height = canvas.height = canvas.offsetHeight || 500;
    };
    window.addEventListener('resize', handleResize);

    // Generate 120 points on a 3D sphere using Fibonacci distribution
    const numPoints = 110;
    const sphereRadius = Math.min(width, height) * 0.38;
    const points: Point3D[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push({
        x: x * sphereRadius,
        y: y * sphereRadius,
        z: z * sphereRadius,
        baseX: x * sphereRadius,
        baseY: y * sphereRadius,
        baseZ: z * sphereRadius,
        size: Math.random() * 2.2 + 1.2,
      });
    }

    let angleX = 0.003;
    let angleY = 0.005;
    let targetAngleX = 0.003;
    let targetAngleY = 0.005;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const fov = 380;

      // Smooth mouse rotation
      angleX += (targetAngleX - angleX) * 0.05;
      angleY += (targetAngleY - angleY) * 0.05;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Rotate all points
      for (const p of points) {
        // Rotate around Y
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // Rotate around X
        let y1 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y1;
        p.z = z2;
      }

      // Sort points by Z for depth rendering
      const sortedPoints = [...points].sort((a, b) => b.z - a.z);

      // Draw 3D connecting lines between nearby points
      ctx.lineWidth = 0.8;
      const maxDistance = sphereRadius * 0.52;

      for (let i = 0; i < sortedPoints.length; i++) {
        const p1 = sortedPoints[i];
        const scale1 = fov / (fov + p1.z);
        const x2d1 = cx + p1.x * scale1;
        const y2d1 = cy + p1.y * scale1;

        for (let j = i + 1; j < sortedPoints.length; j++) {
          const p2 = sortedPoints[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dz = p1.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxDistance) {
            const scale2 = fov / (fov + p2.z);
            const x2d2 = cx + p2.x * scale2;
            const y2d2 = cy + p2.y * scale2;

            // Opacity based on distance and depth
            const avgZ = (p1.z + p2.z) / 2;
            const depthFactor = (avgZ + sphereRadius) / (2 * sphereRadius); // 0 (back) to 1 (front)
            const alpha = (1 - dist / maxDistance) * (depthFactor * 0.45 + 0.05);

            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(x2d1, y2d1);
            ctx.lineTo(x2d2, y2d2);
            ctx.stroke();
          }
        }
      }

      // Draw golden nodes with radial glow
      for (const p of sortedPoints) {
        const scale = fov / (fov + p.z);
        const x2d = cx + p.x * scale;
        const y2d = cy + p.y * scale;
        const radius = p.size * scale;

        const depthFactor = (p.z + sphereRadius) / (2 * sphereRadius);
        const alpha = Math.max(0.15, depthFactor);

        // Outer glow
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, radius * 3.5);
        gradient.addColorStop(0, `rgba(251, 191, 36, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(245, 158, 11, ${alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x2d, y2d, radius * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(255, 245, 204, ${Math.min(1, alpha + 0.3)})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetAngleY = x * 0.015;
      targetAngleX = -y * 0.015;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[500px] aspect-square mx-auto flex items-center justify-center perspective-1000 select-none pointer-events-none"
    >
      {/* 3D Orbiting Gyroscope Glass Rings */}
      <div className="absolute inset-0 flex items-center justify-center preserve-3d">
        {/* Ring 1 - Outer Tilted 3D Ring */}
        <div
          className="absolute w-[86%] h-[86%] rounded-full border border-amber-500/30 border-dashed animate-spin-3d shadow-[0_0_25px_rgba(245,158,11,0.15)]"
          style={{ transform: 'rotateX(68deg) rotateY(15deg)' }}
        />

        {/* Ring 2 - Reverse Orbit Ring */}
        <div
          className="absolute w-[74%] h-[74%] rounded-full border border-amber-400/40 border-t-amber-300 animate-spin-3d-reverse shadow-[0_0_20px_rgba(251,191,36,0.2)]"
          style={{ transform: 'rotateY(60deg) rotateX(25deg)' }}
        />

        {/* Ring 3 - Horizontal Stabilizer Ring */}
        <div
          className="absolute w-[94%] h-[94%] rounded-full border border-amber-500/20 shadow-[0_0_35px_rgba(245,158,11,0.1)]"
          style={{ transform: 'rotateX(82deg)' }}
        />
      </div>

      {/* 3D Canvas Sphere */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

      {/* Center 3D Glowing Core */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.08, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-amber-600/30 backdrop-blur-md border border-amber-400/50 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.5)]"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/50">
            <Sparkles className="w-7 h-7 text-black drop-shadow" />
          </div>
        </motion.div>
      </div>

      {/* Floating 3D Event Hologram Capsules */}
      <motion.div
        animate={{ y: [-8, 8, -8], x: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-6 left-2 z-30 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-amber-500/40 shadow-xl shadow-amber-500/20 flex items-center gap-2 text-xs font-bold text-white pointer-events-auto hover:scale-105 transition-transform"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>Hackathon 2026 · Live</span>
      </motion.div>

      <motion.div
        animate={{ y: [8, -8, 8], x: [3, -3, 3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-8 right-2 z-30 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-amber-500/40 shadow-xl shadow-amber-500/20 flex items-center gap-2 text-xs font-bold text-white pointer-events-auto hover:scale-105 transition-transform"
      >
        <Ticket className="w-3.5 h-3.5 text-amber-400" />
        <span>Instant 3D QR Tickets</span>
      </motion.div>

      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-10 left-6 z-30 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-amber-500/40 shadow-xl shadow-amber-500/20 flex items-center gap-2 text-xs font-bold text-white pointer-events-auto hover:scale-105 transition-transform"
      >
        <Award className="w-3.5 h-3.5 text-amber-400" />
        <span>Verified NFT Certificates</span>
      </motion.div>
    </div>
  );
}

