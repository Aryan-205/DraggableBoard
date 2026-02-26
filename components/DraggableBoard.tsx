import React, { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { LuMaximize } from "react-icons/lu";
import { GoPlus } from 'react-icons/go';
import NoteCard from './NoteCard';
import ToDoCard from './ToDoCard';
import ImageCard from './ImageCard';
import {motion} from 'framer-motion';
import InfiniteCanvas from './InfiniteCanvas';
import DraggableCard from './DraggableCard';

type Variant = 'embedded' | 'fullscreen';

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

  const [components, setComponents] = useState<React.ReactNode[]>([
    <NoteCard key='note' />,
    <ToDoCard key='todo' />,
    <ImageCard key='image' />
  ]);

  const addComponent = (component: 'note' | 'todo' | 'image') => {
    console.log(component);
    if (component === 'note') {
      setComponents([...components, <NoteCard key='note' />]);
    } else if (component === 'todo') {
      setComponents([...components, <ToDoCard key='todo' />]);
    } else if (component === 'image') {
      setComponents([...components, <ImageCard key='image' />]);
    }
  }

  const removeComponent = (component: 'note' | 'todo' | 'image') => {
    console.log(component);
    if (component === 'note') {
      setComponents(components.filter((_, index) => index !== components.indexOf(<NoteCard key='note' />)));
    } else if (component === 'todo') {
      setComponents(components.filter((_, index) => index !== components.indexOf(<ToDoCard key='todo' />)));
    } else if (component === 'image') {
      setComponents(components.filter((_, index) => index !== components.indexOf(<ImageCard key='image' />)));
    }
  }

  return (
    <motion.div 
      ref={containerRef}
      layout 
      animate={{height: variant === 'embedded' ? 400 : '100%'}} 
      transition={{type: 'spring', stiffness: 300, damping: 20, mass: 0.8, duration: 0.3}} 
      className={cn(
        'w-full rounded-3xl border-3 border-[#FFE66E] bg-white overflow-hidden relative', 
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
      <motion.div className='w-full h-full flex flex-wrap gap-4 p-4'>
        <InfiniteCanvas className='w-full h-full flex flex-wrap gap-4 p-4 cursor-grab active:cursor-grabbing'>
          {components.map((component, index) => (
            <DraggableCard 
              key={index} 
              card={{id: index, component: component}} 
              containerRef={containerRef} 
              removeComponent={(id: string | number) => removeComponent(id as 'note' | 'todo' | 'image')} 
              index={index} 
              infinite={true} 
            />
          ))}
        </InfiniteCanvas>
      </motion.div>
    </motion.div>
  );
}   