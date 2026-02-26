"use client"
import React, { useState, useRef, useEffect, ReactNode, RefObject } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoIosClose } from 'react-icons/io';

interface CardData {
  id: string | number;
  component: ReactNode;
}

interface DraggableCardProps {
  card: CardData;
  containerRef: RefObject<HTMLDivElement | null>;
  removeComponent: (id: string | number) => void;
  index?: number;
  /** When true, no drag constraints (infinite canvas). */
  infinite?: boolean;
}

function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

export default function DraggableCard({
  card,
  containerRef,
  removeComponent,
  index = 0,
  infinite = false,
}: DraggableCardProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(cardRef, () => setIsActive(false));

  const layoutIndex = typeof card.id === "number" ? card.id : index;

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={infinite ? false : containerRef}
      dragMomentum={false}
      onClick={(e) => {
        e.stopPropagation();
        setIsActive(true);
      }}
      initial={{
        top: layoutIndex % 2 === 0 ? "20%" : "40%",
        left: layoutIndex % 2 === 0 ? "20%" : "60%",
        rotate: layoutIndex % 2 === 0 ? "-3deg" : "3deg",
      }}
      whileDrag={{
        scale: 1.05,
        zIndex: 50,
        cursor: 'grabbing',
      }}
      // Visual feedback: Higher Z-index when active
      animate={{
        zIndex: isActive ? 40 : 10,
        scale: isActive ? 1.02 : 1, // Subtle pop when active
      }}
      data-draggable-card
      className={`absolute transition-shadow ${
        isActive
          ? 'cursor-default drop-shadow-lg'
          : 'hover:cursor-grab active:cursor-grabbing'
      }`}
    >
      <AnimatePresence>
        {isActive && (
          <motion.button
            key="close-btn"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => {
              e.stopPropagation();
              removeComponent(card.id);
            }}
            className="p-1 rounded-full bg-white cursor-pointer shadow-[0_1px_10px_0_rgba(0,0,0,0.1)] absolute -top-10 right-0 z-50 flex items-center justify-center hover:bg-gray-50"
          >
            <IoIosClose color="#2E2E2E" size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className={isActive ? 'pointer-events-auto' : 'pointer-events-none'}>
        {card.component}
      </div>
    </motion.div>
  );
};