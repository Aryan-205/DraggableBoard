"use client"
import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi';

type Task = {
  id: number;
  title: string;
  checked: boolean;
}

export default function ToDoCard() {  

  // 1. Initial state has only one task
  const [tasks, setTasks] = useState<Task[]>([
    {id: Date.now(), title: 'Add Task', checked: false}
  ])

  const handleToggle = (id: number) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === id ? { ...task, checked: !task.checked } : task
    ))
  }

  const handleTitleChange = (id: number, newTitle: string) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === id ? { ...task, title: newTitle } : task
    ))
  }

  // 2. Handle Enter Key to add new task
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newTask: Task = {
        id: Date.now(), // Unique ID based on time
        title: 'Add Task', // Default title
        checked: false
      };
      setTasks([...tasks, newTask]);
    }
  }

  // 3. UX Helper: Select all text if title is "Add Task" so you can overwrite it easily
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === 'Add Task') {
      e.target.select();
    }
  }

  return (
    <div className='text-[#2E2E2E] flex flex-col gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 bg-[#FFFDF4] border border-[#FFE66E] shadow-[0_1px_10px_0_rgba(0,0,0,0.1)] rounded-lg sm:rounded-xl p-2 sm:p-2.5 md:p-3 lg:p-4 w-36 sm:w-40 md:w-48 lg:w-64 h-auto min-h-24 sm:min-h-28 md:min-h-32 lg:min-h-48'>
      <div className='flex justify-between items-center'>
        <p className='text-sm sm:text-base md:text-lg lg:text-xl font-semibold w-full text-left'>Todo</p>
        <button 
          onClick={()=>setTasks([...tasks, {id: Date.now(), title: 'Add Task', checked: false}])}
          className='bg-white rounded-md p-2 flex gap-2 items-center shadow-[0_1px_10px_0_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-300 cursor-pointer'>
          <FiPlus color='#2E2E2E'/>
        </button>
      </div>
      
      <div className='flex flex-col gap-1 sm:gap-1.5 md:gap-2 overflow-y-auto max-h-32 sm:max-h-36 md:max-h-44 lg:max-h-60'>
        {tasks.map((task) => (
          <div key={task.id} className='flex gap-2 font-light items-center'>
            
            <input 
              type="checkbox" 
              checked={task.checked} 
              onChange={() => handleToggle(task.id)} 
              className='cursor-pointer accent-[#FFE66E] shrink-0'
            />
            
            <input 
              type="text" 
              className={`outline-0 w-full bg-transparent text-xs sm:text-sm md:text-base ${task.checked ? 'line-through text-gray-400' : ''}`}
              value={task.title}
              onChange={(e) => handleTitleChange(task.id, e.target.value)}
              onKeyDown={handleKeyDown} 
              onFocus={handleFocus}
            />
          </div>
        ))}
      </div>
    </div>
  )
}