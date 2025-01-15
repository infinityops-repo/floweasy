'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Node {
  name: string
  displayName: string
  description: string
  icon?: string
}

export function NodesPanel() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNodes() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_N8N_API_URL}/nodes`, {
          headers: {
            'X-N8N-API-KEY': process.env.NEXT_PUBLIC_N8N_API_KEY || ''
          }
        });
        if (response.ok) {
          const data = await response.json();
          setNodes(data);
        } else {
          console.error('Failed to fetch nodes');
        }
      } catch (error) {
        console.error('Error fetching nodes:', error);
      }
      setLoading(false);
    }
    loadNodes();
  }, []);

  const filteredNodes = nodes.filter(node => 
    node.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading nodes...</div>
        ) : (
          <div className="grid gap-2">
            {filteredNodes.map((node) => (
              <div
                key={node.name}
                className="p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {node.icon && (
                    <img src={node.icon || "/placeholder.svg"} alt="" className="w-5 h-5" />
                  )}
                  <span className="font-medium">{node.displayName}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {node.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

