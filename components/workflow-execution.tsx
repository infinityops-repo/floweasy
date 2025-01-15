'use client'

import { useState } from 'react'
import { Loader2, MessageSquare } from 'lucide-react'
import { generateWorkflow } from '@/app/actions'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { WorkflowViewer } from './workflow-viewer'
import { Textarea } from "@/components/ui/textarea"

interface WorkflowExecutionProps {
  initialPrompt?: string
}

export function WorkflowExecution({ initialPrompt = '' }: WorkflowExecutionProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [isExecuting, setIsExecuting] = useState(false)
  const [workflowResult, setWorkflowResult] = useState<any>(null)

  const handleExecute = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a workflow description first')
      return
    }

    setIsExecuting(true)
    setWorkflowResult(null)
    
    try {
      console.log('Generating workflow with prompt:', prompt)
      const result = await generateWorkflow(prompt)
      
      if (result.success && result.data) {
        console.log('Workflow generated successfully:', result.data)
        setWorkflowResult(result.data)
        toast.success('Workflow generated successfully')
      } else {
        console.error('Failed to generate workflow:', result.error)
        toast.error(result.error || 'Failed to generate workflow')
      }
    } catch (err) {
      console.error('Unexpected error during workflow generation:', err)
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      toast.error(errorMessage)
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <>
      {workflowResult && (
        <div className="flex-1 mb-4">
          <WorkflowViewer workflow={workflowResult} />
        </div>
      )}
    </>
  )
}

