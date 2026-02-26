import React, { useRef } from 'react'

export default function NoteCard() {
  // 1. We tell TS this ref refers to a text area
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  return (
    <div className='bg-[#FFFDF4] border border-[#FFE66E] shadow-[0_1px_10px_0_rgba(0,0,0,0.1)] rounded-xl p-4 w-64 h-auto min-h-12'>
      <textarea 
        ref={textareaRef}
        onInput={handleInput}
        className='outline-0 text-[#2E2E2E] text-sm font-medium w-full resize-none bg-transparent overflow-hidden'
        placeholder='Add a note'
        rows={1}
      />
    </div>
  )
}