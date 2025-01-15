'use server'

import { WorkflowExecutionResult } from './types/n8n'

const N8N_API_URL = `${process.env.NEXT_PUBLIC_N8N_API_URL}/api/v1`
const N8N_API_KEY = process.env.NEXT_PUBLIC_N8N_API_KEY

export async function generateWorkflow(prompt: string): Promise<WorkflowExecutionResult> {
  if (!N8N_API_URL || !N8N_API_KEY) {
    console.error('N8N configuration is missing')
    return { 
      success: false, 
      error: 'N8N configuration is missing' 
    }
  }

  try {
    console.log('Fetching available nodes from n8n...')
    const nodesResponse = await fetch(`${N8N_API_URL}/nodes`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY
      }
    })

    if (!nodesResponse.ok) {
      const errorText = await nodesResponse.text()
      console.error('Failed to fetch available nodes:', errorText)
      throw new Error(`Failed to fetch available nodes: ${nodesResponse.statusText}. ${errorText}`)
    }

    const availableNodes = await nodesResponse.json()
    console.log('Available nodes:', JSON.stringify(availableNodes, null, 2))

    const workflowData = {
      name: `Workflow from prompt: ${prompt}`,
      nodes: [
        {
          parameters: {},
          name: 'Start',
          type: 'n8n-nodes-base.start',
          typeVersion: 1,
          position: [100, 300]
        }
      ],
      connections: {},
      active: false,
      settings: {},
      tags: []
    }

    if (prompt.toLowerCase().includes('dolar') || prompt.toLowerCase().includes('exchange rate')) {
      workflowData.nodes.push({
        parameters: {
          url: 'https://api.exchangerate-api.com/v4/latest/USD',
          method: 'GET',
          authentication: 'none',
          options: {}
        },
        name: 'HTTP Request',
        type: 'n8n-nodes-base.httpRequest',
        typeVersion: 4,
        position: [300, 300]
      })

      workflowData.connections['Start'] = {
        main: [
          [
            {
              node: 'HTTP Request',
              type: 'main',
              index: 0
            }
          ]
        ]
      }
    }

    console.log('Creating workflow with data:', JSON.stringify(workflowData, null, 2))

    const response = await fetch(`${N8N_API_URL}/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-API-KEY': N8N_API_KEY
      },
      body: JSON.stringify(workflowData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('N8N API Error:', errorText)
      throw new Error(`Failed to create workflow: ${response.statusText}. ${errorText}`)
    }

    const createdWorkflow = await response.json()
    console.log('Workflow created successfully:', JSON.stringify(createdWorkflow, null, 2))

    return { 
      success: true, 
      data: createdWorkflow
    }
  } catch (error) {
    console.error('Workflow generation error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unknown error occurred during workflow generation'
    }
  }
}

