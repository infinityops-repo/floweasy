import ReactFlow, {
  Background,
  Controls,
  Node,
  Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'

interface WorkflowViewerProps {
  workflow: any; // We'll use a more flexible type to handle potential errors
}

export function WorkflowViewer({ workflow }: WorkflowViewerProps) {
  if (!workflow || typeof workflow !== 'object') {
    return (
      <div className="flex items-center justify-center h-full w-full text-zinc-400">
        Invalid workflow data
      </div>
    )
  }

  if ('error' in workflow) {
    return (
      <div className="flex items-center justify-center h-full w-full text-zinc-400">
        Error: {typeof workflow.error === 'string' ? workflow.error : 'An unexpected error occurred'}
      </div>
    )
  }

  if (!Array.isArray(workflow.nodes) || workflow.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full text-zinc-400">
        No nodes available in the workflow
      </div>
    )
  }

  const nodes: Node[] = workflow.nodes.map((node: any) => ({
    id: node.name,
    type: 'default',
    position: { x: node.position[0], y: node.position[1] },
    data: { label: node.name },
  }))

  const edges: Edge[] = workflow.connections
    ? Object.entries(workflow.connections).flatMap(([sourceNode, connection]: [string, any]) => 
        connection.main.flatMap((targets: any[], sourceIndex: number) =>
          targets.map((target: any) => ({
            id: `e${sourceNode}-${target.node}-${sourceIndex}`,
            source: sourceNode,
            target: target.node,
            animated: true,
          }))
        )
      )
    : [];

  return (
    <div className="w-full" style={{ height: '500px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        className="bg-zinc-900"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

