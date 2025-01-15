import { GitBranch } from 'lucide-react'

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <GitBranch className="h-6 w-6 text-blue-500" />
      <span className="font-bold text-xl tracking-tight">
        flow<span className="text-blue-500">easy</span>
      </span>
    </div>
  )
}

