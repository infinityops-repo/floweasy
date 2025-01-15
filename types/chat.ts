export interface Chat {
  id: string
  title: string
  createdAt: Date
  messages: Message[]
}

export interface Message {
  id: string
  content: string
  createdAt: Date
}

