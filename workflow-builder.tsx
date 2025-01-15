// Previous imports remain the same
import { WorkflowExecution } from './components/workflow-execution'

export default function WorkflowBuilder() {
  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {/* Left Sidebar and Header remain the same */}
      
      {/* Update the right panel to use the new WorkflowExecution component */}
      <div className="flex-1 bg-[#1E1E1E] relative">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#232323,#232323_10px,#1E1E1E_10px,#1E1E1E_20px)]">
          <div className="flex items-center justify-center h-full">
            <WorkflowExecution />
          </div>
        </div>
        
        {/* Zoom Controls remain the same */}
      </div>
    </div>
  )
}

