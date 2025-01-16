'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { decodePrompt } from '@/lib/utils'

interface WorkflowSearchParamsProps {
  setMessage: (message: string) => void
}

export function WorkflowSearchParams({ setMessage }: WorkflowSearchParamsProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const encodedPrompt = searchParams.get('prompt')
    if (encodedPrompt) {
      const decodedPrompt = decodePrompt(encodedPrompt)
      setMessage(decodedPrompt)
    }
  }, [searchParams, setMessage])

  return null
} 