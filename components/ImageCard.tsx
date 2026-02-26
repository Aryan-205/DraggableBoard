"use client"
import Image from 'next/image';
import React, { useState } from 'react'
import { FiUpload } from "react-icons/fi";

export default function ImageCard() {

  const [image, setImage] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  }

  return (
    <div className='relative bg-[#F4F4F4] w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 shadow-[0_1px_10px_0_rgba(0,0,0,0.1)] rounded-lg sm:rounded-xl overflow-hidden flex justify-center items-center'>
      
      <div className='flex flex-col gap-1 sm:gap-2 items-center'>
        <FiUpload color='#939393' className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"/>
        <p className='text-xs sm:text-sm text-[#939393] font-semibold'>Upload</p>
      </div>

      <input 
        name='image' 
        onChange={handleImageChange} 
        type="file" 
        className='opacity-0 absolute inset-0 w-full h-full z-20 cursor-pointer' 
      />

      {image && (
        <Image 
          src={image} 
          alt='Preview' 
          fill
          className='object-cover z-10' 
        />
      )}
    </div>
  )
}