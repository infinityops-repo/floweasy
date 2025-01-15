'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from "framer-motion"

export function WorkflowPreview() {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Terminal window */}
      <div className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-2xl">
        {/* Terminal header */}
        <div className="bg-[#2D2D2D] px-3 py-2 flex items-center">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
        </div>

        {/* Terminal content */}
        <div className="p-4">
          <div className="mt-1 bg-white rounded-sm overflow-hidden">
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oqaRnwWrzl9M6DiphSPI6elNtPC2Ow.png"
                alt="DALL-E Telegram Bot Workflow"
                width={800}
                height={450}
                className="w-full h-auto"
                quality={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

