export interface N8nResponse {
  data?: any
  error?: {
    message: string
    code?: string
  }
}

export interface WorkflowExecutionResult {
  success: boolean
  data?: any
  error?: string
}

export interface WorkflowError {
  message: string
  code?: string
}

