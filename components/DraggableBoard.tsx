import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { LuMaximize } from "react-icons/lu";
import { GoPlus } from 'react-icons/go';
import NoteCard from './NoteCard';
import ToDoCard from './ToDoCard';
import ImageCard from './ImageCard';
import {motion} from 'framer-motion';
import DraggableCard from './DraggableCard';

type Variant = 'embedded' | 'fullscreen';

type CardItem = { id: number; component: React.ReactNode };

let nextCardId = 0;
function makeCard(type: 'note' | 'todo' | 'image'): CardItem {
  const id = nextCardId++;
  const component =
    type === 'note' ? <NoteCard key={id} /> : type === 'todo' ? <ToDoCard key={id} /> : <ImageCard key={id} />;
  return { id, component };
}

export default function DraggableBoard({
  variant: variantProp,
  setVariant: setVariantProp,
}: {
  variant?: Variant;
  setVariant?: (variant: Variant) => void;
} = {}) {
  const [internalVariant, setInternalVariant] = useState<Variant>('embedded');
  const containerRef = useRef<HTMLDivElement>(null);
  const variant = setVariantProp ? variantProp ?? internalVariant : internalVariant;
  const setVariant = setVariantProp ?? setInternalVariant;

  const [cards, setCards] = useState<CardItem[]>(() => [
    makeCard('note'),
    makeCard('todo'),
    makeCard('image'),
  ]);

  const addComponent = (component: 'note' | 'todo' | 'image') => {
    setCards((prev) => [...prev, makeCard(component)]);
  };

  const removeComponent = (id: string | number) => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (Number.isNaN(numId)) return;
    setCards((prev) => prev.filter((c) => c.id !== numId));
  };

  const canvasRef = useRef<HTMLDivElement>(null);

  // Canvas size so we can center the view with equal room to scroll in all directions
  const CANVAS_WIDTH = 8000;
  const CANVAS_HEIGHT = 5000;

  const centerScroll = () => {
    const scrollable = containerRef.current;
    if (!scrollable) return;
    const maxScrollX = Math.max(0, CANVAS_WIDTH - scrollable.clientWidth);
    const maxScrollY = Math.max(0, CANVAS_HEIGHT - scrollable.clientHeight);
    scrollable.scrollLeft = maxScrollX / 2;
    scrollable.scrollTop = maxScrollY / 2;
  };

  // Start view from center so there's room for left/right and up/down scroll
  useEffect(() => {
    centerScroll();
    // Run again after layout (e.g. after variant animates or fonts load)
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(centerScroll);
    });
    return () => cancelAnimationFrame(t);
  }, [variant]);

  return (
    <motion.div 
      ref={containerRef}
      layout 
      animate={{height: variant === 'embedded' ? 400 : '100%'}} 
      transition={{type: 'spring', stiffness: 300, damping: 20, mass: 0.8, duration: 0.3}} 
      className={cn(
        'w-full rounded-3xl border-3 border-[#FFE66E] bg-white overflow-auto relative hidden-scroll', 
        variant === 'embedded' ? 'w-full h-[400px]' : 'w-full h-full'
      )}
    >
      <div className='sticky top-0 left-0 w-full flex justify-between items-center p-2 z-50'>
        <div className='flex gap-2 items-center'>
          <button onClick={() => addComponent('note')} className='bg-white rounded-xl p-1 pr-2 flex gap-2 items-center shadow-[0_1px_10px_0_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-300 cursor-pointer'>
            <div className='flex items-center justify-center rounded-lg bg-[#FFF1EB] p-1'>
              <GoPlus color='#FF5100' size={24} />
            </div>
            <p className='text-sm font-medium text-black'>Note</p>
          </button>
          <button onClick={() => addComponent('todo')} className='bg-white rounded-xl p-1 pr-2 flex gap-2 items-center shadow-[0_1px_10px_0_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-300 cursor-pointer'>
            <div className='flex items-center justify-center rounded-lg bg-[#FFF1EB] p-1'>
              <GoPlus color='#FF5100' size={24} />
            </div>
            <p className='text-sm font-medium text-black'>To Do</p>
          </button>
          <button onClick={() => addComponent('image')} className='bg-white rounded-xl p-1 pr-2 flex gap-2 items-center shadow-[0_1px_10px_0_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-300 cursor-pointer'>
            <div className='flex items-center justify-center rounded-lg bg-[#FFF1EB] p-1'>
              <GoPlus color='#FF5100' size={24} />
            </div>
            <p className='text-sm font-medium text-black'>Image</p>
          </button>
          
        </div>
        <button onClick={() => setVariant(variant === 'embedded' ? 'fullscreen' : 'embedded')} className='bg-white rounded-xl p-2 flex gap-2 items-center shadow-[0_1px_10px_0_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-300 cursor-pointer'>
        <LuMaximize color='#2E2E2E' size={24} />
        </button>
      </div>
      <motion.div
        ref={canvasRef}
        className='relative cursor-grab active:cursor-grabbing'
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          backgroundColor: '#FFFFFF',
          backgroundRepeat: 'repeat',
          backgroundSize: '40px 40px',
          backgroundPosition: 'center',
          backgroundImage: 'radial-gradient(#FFE66E 2px, transparent 0)',
        }}
        drag
        dragConstraints={containerRef}
        dragMomentum={false}
      >
          {cards.map((card, index) => (
            <DraggableCard
              key={card.id}
              card={{ id: card.id, component: card.component }}
              containerRef={containerRef}
              removeComponent={removeComponent}
              index={index}
            />
          ))}
      </motion.div>
    </motion.div>
  );
}   