"use client";

import React, { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";

const MIN_SCALE = 0.25;
const MAX_SCALE = 2;
const SCALE_STEP = 0.1;

interface InfiniteCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export default function InfiniteCanvas({ children, className }: InfiniteCanvasProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const panStart = useRef({ x: 0, y: 0, startX: 0, startY: 0 });
  const isPanning = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-draggable-card]")) return;
      if (e.button !== 0) return;
      isPanning.current = true;
      panStart.current = {
        x: position.x,
        y: position.y,
        startX: e.clientX,
        startY: e.clientY,
      };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [position]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isPanning.current) return;
      setPosition({
        x: panStart.current.x + e.clientX - panStart.current.startX,
        y: panStart.current.y + e.clientY - panStart.current.startY,
      });
    },
    []
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (e.button === 0) {
      isPanning.current = false;
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
      setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta)));
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className={className}
      onWheel={handleWheel}
      style={{ 
        overflow: "hidden", 
        touchAction: "none",
        backgroundRepeat: "repeat",
        backgroundSize: "40px 40px",
        backgroundPosition: "center",
        backgroundImage: "radial-gradient(#FFE66E 2px, transparent 0)",
      }}
    >
      {/* Cursor control (cursor-grab / cursor-grabbing) commented out - pan only */}
      <motion.div
        data-infinite-canvas-pan
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="border-2 border-[#FFE66E] flex items-center justify-center"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 5000,
          height: 5000,
          x: position.x,
          y: position.y,
          scale,
          backgroundRepeat: "repeat",
          backgroundSize: "40px 40px",
          backgroundPosition: "center",
          backgroundImage: "radial-gradient(#FFE66E 2px, transparent 0)",
          backgroundColor: "#FFFFFF",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
