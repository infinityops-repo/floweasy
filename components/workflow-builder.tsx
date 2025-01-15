'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, X, Maximize2, Search, ZoomIn, ZoomOut, MessageSquare, ArrowUp, LogOut, Link2, PanelLeftClose, PanelLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WorkflowExecution } from './workflow-execution'
import { SignIn } from './SignIn'
import { SignUp } from './SignUp'
import { supabase, getSupabase } from '@/lib/supabase-client' // Import getSupabase function
import { toast } from 'sonner'
import { decodePrompt } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Theme, getTheme, setTheme } from '@/lib/theme'
import { WorkflowViewer } from './workflow-viewer'; // Import WorkflowViewer component
import { debounce } from 'lodash';

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  messages: any[];
}

async function generateWorkflow(prompt: string) {
  // Replace this with your actual workflow generation logic
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error };
  }
}

export default function WorkflowBuilder() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('')
  const [session, setSession] = useState<any>(null)
  const [authView, setAuthView] = useState<'signIn' | 'signUp'>('signIn')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [theme, setCurrentTheme] = useState<Theme>(getTheme)
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedWorkflow, setGeneratedWorkflow] = useState(null); // Added state for generated workflow

  const generateWorkflowWithOpenAI = async (prompt: string) => {
    try {
      const response = await fetch('/api/generate-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate workflow');
      }

      if (!data || Object.keys(data).length === 0) {
        throw new Error('Received empty response from server');
      }

      setGeneratedWorkflow(data);
      console.log('Generated workflow:', data);
    } catch (error) {
      console.error('Error generating workflow:', error);
      setGeneratedWorkflow({ error: error instanceof Error ? error.message : 'An unexpected error occurred' });
      toast.error(error instanceof Error ? error.message : 'Failed to generate workflow. Please try again.');
    }
  };

  useEffect(() => {
    const encodedPrompt = searchParams.get('prompt')
    if (encodedPrompt) {
      const decodedPrompt = decodePrompt(encodedPrompt)
      setMessage(decodedPrompt)
    }
  }, [searchParams])

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data: { session } }) => { // Updated with getSupabase()
      setSession(session)
    })

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((_event, session) => { // Updated with getSupabase()
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    setTheme(theme)
  }, [theme])

  useEffect(() => {
    if (message.trim()) {
      const delayDebounceFn = setTimeout(() => {
        generateWorkflowWithOpenAI(message);
      }, 1000);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [message]);


  const handleSignOut = async () => { // Updated with getSupabase()
    const { error } = await getSupabase().auth.signOut()
    if (error) {
      toast.error('Error signing out')
    } else {
      toast.success('Signed out successfully')
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const createNewChat = () => {
    const newChat: Chat = {
      id: Math.random().toString(36).substring(7),
      title: 'New Chat',
      createdAt: new Date(),
      messages: []
    }
    setChats(prev => [...prev, newChat])
    setActiveChat(newChat.id)
  }

  const handleSubmit = async () => {
    if (!message.trim() || isSubmitting) return
    setIsSubmitting(true)
    
    try {
      const workflowResult = await generateWorkflow(message)
      if (workflowResult.success) {
        toast.success('Workflow generated successfully!')
        // Add the message to chat history
        if (activeChat) {
          setChats(prevChats => 
            prevChats.map(chat => 
              chat.id === activeChat 
                ? {
                    ...chat,
                    messages: [...chat.messages, { content: message, timestamp: new Date() }]
                  }
                : chat
            )
          )
        }
      } else {
        toast.error(workflowResult.error || 'Failed to generate workflow')
      }
    } catch (error) {
      console.error('An error occurred while generating the workflow:', error);
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred while generating the workflow');
    } finally {
      setIsSubmitting(false);
    }
  }

  const debouncedGenerateWorkflow = debounce(generateWorkflowWithOpenAI, 500);

  if (!session) {
    return (
      <div className="flex h-screen bg-zinc-900 text-white items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-zinc-800 border-zinc-700">
          <h2 className="text-3xl font-bold text-center mb-6">
            {authView === 'signIn' ? 'Sign In' : 'Sign Up'}
          </h2>
          {authView === 'signIn' ? <SignIn /> : <SignUp />}
          <p className="text-center mt-6">
            {authView === 'signIn' ? (
              <>
                Don't have an account?{' '}
                <button className="text-blue-400 hover:underline" onClick={() => setAuthView('signUp')}>
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button className="text-blue-400 hover:underline" onClick={() => setAuthView('signIn')}>
                  Sign In
                </button>
              </>
            )}
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left Sidebar - Updated with transition */}
      <div
        className={cn(
          "w-[240px] bg-card flex flex-col fixed h-full transition-transform duration-300 ease-in-out z-40 border-r",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Project Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Project</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-lg bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              onClick={createNewChat}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conversations Area */}
        <div className="flex-1 p-4 space-y-2">
          {chats.length === 0 ? (
            <div className="text-sm text-zinc-400">
              Your conversations will appear here
              <br />once you start chatting!
            </div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                className="flex items-center gap-2 group"
              >
                <button
                  onClick={() => setActiveChat(chat.id)}
                  className={cn(
                    "flex-1 text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    activeChat === chat.id 
                      ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" 
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  )}
                >
                  {chat.title}
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setChats(chats => chats.filter(c => c.id !== chat.id))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-4 space-y-4">
          {/* Token Counter */}
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link2 className="h-4 w-4" />
            <span>0 tokens available</span>
          </div>

          {/* Buy More Button */}
          <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300">
            <Plus className="h-4 w-4" />
            <span>Buy more</span>
          </button>

          <Separator className="bg-zinc-800" />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.user_metadata?.avatar_url || ''} />
                  <AvatarFallback>
                    {session.user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-zinc-400 truncate max-w-[160px]">
                  {session.user.email}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-[200px]">
              <DropdownMenuItem 
                onClick={() => setCurrentTheme(theme === 'dark' ? 'light' : 'dark')} 
                className="text-zinc-400 hover:text-white focus:text-white cursor-pointer"
              >
                {theme === 'dark' ? 'Toggle light mode' : 'Toggle dark mode'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-zinc-400 hover:text-white focus:text-white cursor-pointer">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content - Updated with margin transition */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        isSidebarOpen ? "ml-[240px]" : "ml-0"
      )}>
        {/* Main Area */}
        <div className="flex-1 flex">
          <div className="flex-1 p-8 max-w-3xl mx-auto w-full flex flex-col">
            <div className="flex justify-center gap-2 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-800"
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                ) : (
                  <PanelLeft className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                )}
              </Button>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-2xl font-semibold mb-2">
                What n8n workflow would you like to create?
              </h1>
              <p className="text-zinc-400">
                Describe your workflow, and I'll help you build it.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <WorkflowCard
                title="Chat with PDFs"
                description="using AI and Google Drive"
              />
              <WorkflowCard
                title="AI Web Scraper"
                description="with HTTP Request node"
              />
              <WorkflowCard
                title="OpenAI Assistant"
                description="with conversation memory"
              />
              <WorkflowCard
                title="Custom AI Agent"
                description="using any data source"
              />
            </div>

            <div className="mt-auto">
              {/* Message Input */}
              <div className="relative">
                <Textarea 
                  placeholder="Describe your workflow idea (OpenAI will generate it)..."
                  className="min-h-[120px] w-full resize-none bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (e.target.value.trim()) {
                      debouncedGenerateWorkflow(e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                />
                <Button 
                  size="icon"
                  variant="ghost" 
                  className="absolute right-2 bottom-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !message.trim()}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Updated with workflow execution and nodes panel */}
          <div className="flex-1 flex">
            <div className="flex-1 bg-muted relative">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,hsl(var(--muted)),hsl(var(--muted))_10px,hsl(var(--background))_10px,hsl(var(--background))_20px)]">
                <div className="flex items-center justify-center h-full w-full">
                  {generatedWorkflow ? (
                    'error' in generatedWorkflow ? (
                      <div className="text-center text-zinc-500">
                        <p>Error: {typeof generatedWorkflow.error === 'string' ? generatedWorkflow.error : 'An unexpected error occurred'}</p>
                        <p>Please try again with a different description.</p>
                      </div>
                    ) : (
                      <WorkflowViewer workflow={generatedWorkflow} />
                    )
                  ) : (
                    <div className="text-center text-zinc-500">
                      <p>Your generated workflow will appear here.</p>
                      <p>Describe your workflow idea in the text area below.</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex gap-1">
                <Button variant="outline" size="icon" className="bg-background border-border h-8 w-8">
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-background border-border h-8 w-8">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-background border-border h-8 w-8">
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

function WorkflowCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-card/50 border-border/50 p-4 hover:bg-card/80 transition-colors cursor-pointer">
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  )
}

