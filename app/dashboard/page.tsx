import { Suspense } from 'react'
import WorkflowBuilder from '@/components/workflow-builder'

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WorkflowBuilder />
    </Suspense>
  )
}

