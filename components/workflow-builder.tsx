'use client'

import { useState, useEffect, Suspense } from 'react'
import { Plus, X, Maximize2, Search, ZoomIn, ZoomOut, MessageSquare, ArrowUp, LogOut, Link2, PanelLeftClose, PanelLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WorkflowExecution } from './workflow-execution'
import { SignIn } from './SignIn'
import { SignUp } from './SignUp'
import { getSupabase } from '@/lib/supabase-client'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Theme, getTheme, setTheme } from '@/lib/theme'
import { WorkflowViewer } from './workflow-viewer'
import { debounce } from 'lodash'
import { WorkflowSearchParams } from './workflow-search-params'

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  messages: any[];
}

async function generateWorkflow(prompt: string) {
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
  const [message, setMessage] = useState('')
  const [session, setSession] = useState<any>(null)
  const [authView, setAuthView] = useState<'signIn' | 'signUp'>('signIn')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [theme, setCurrentTheme] = useState<Theme>(getTheme)
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedWorkflow, setGeneratedWorkflow] = useState(null)

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
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((_event, session) => {
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

  const handleSignOut = async () => {
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
      <Suspense fallback={null}>
        <WorkflowSearchParams setMessage={setMessage} />
      </Suspense>
      
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

        {/* Rest of your component */}
      </div>
    </div>
  )
}

