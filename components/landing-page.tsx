'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { X, Link2, Wand2, ArrowRight, Sparkles, Check } from 'lucide-react'
import { SignIn } from './SignIn'
import { SignUp } from './SignUp'
import { Logo } from './ui/logo'
import { WorkflowPreview } from './workflow-preview'
import { encodePrompt } from '@/lib/utils'

export function LandingPage() {
  const router = useRouter()
  const [showSignIn, setShowSignIn] = useState(false)
  const [authView, setAuthView] = useState<'signIn' | 'signUp'>('signIn')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      setShowSignIn(true)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
        <div className="flex items-center justify-between py-2 px-4 border-b border-zinc-800/50 relative">
          <Logo />
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">New: AI-powered workflow generation</span>
            <Sparkles className="h-4 w-4 text-blue-500" />
          </div>
          <Button
            variant="ghost"
            className="text-sm hover:text-blue-400"
            onClick={() => setShowSignIn(true)}
          >
            Sign in
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 -top-[500px] bg-gradient-to-b from-blue-500/20 via-purple-500/5 to-transparent blur-3xl" />
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            What workflow do you<br />want to build?
          </h1>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
            Generate powerful n8n workflows with AI assistance.<br />
            From idea to deployment in minutes.
          </p>
        </div>

        {/* Prompt Input */}
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mb-16 relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative">
            <Textarea
              placeholder="Describe your workflow idea..."
              className="min-h-[120px] w-full resize-none bg-zinc-900/70 backdrop-blur border-zinc-800/50 rounded-xl p-4 text-lg shadow-xl"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-blue-400 transition-colors">
                <Link2 className="h-5 w-5" />
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity"
              >
                Generate
                <Wand2 className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </form>

        {/* Workflow Preview Section */}
        <div className="py-20 border-t border-zinc-800/50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Powerful IT Workflow Automation
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Streamline your IT operations with automated workflows. Connect your tools, automate processes, and boost efficiency.
              </p>
            </div>
            <WorkflowPreview />
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-20 border-t border-zinc-800/50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Choose the plan that's right for you and start automating your workflows today.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800">
                <h3 className="text-xl font-semibold mb-4">Free</h3>
                <p className="text-3xl font-bold mb-6">$0<span className="text-lg font-normal text-zinc-400">/month</span></p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>5 workflows</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>100 executions/month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Community support</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline">Get Started</Button>
              </div>
              <div className="bg-blue-600 p-8 rounded-xl border border-blue-500 relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-semibold px-2 py-1 rounded-full">
                  POPULAR
                </div>
                <h3 className="text-xl font-semibold mb-4">Pro</h3>
                <p className="text-3xl font-bold mb-6">$15<span className="text-lg font-normal text-zinc-200">/month</span></p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-300 mr-2" />
                    <span>50 workflows/month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-300 mr-2" />
                    <span>10,000 executions/month</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-300 mr-2" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-300 mr-2" />
                    <span>Advanced integrations</span>
                  </li>
                </ul>
                <Button className="w-full bg-white text-blue-600 hover:bg-zinc-100">Upgrade to Pro</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <QuickActionCard
            title="Create a webhook integration"
            description="Build an HTTP endpoint with n8n"
            icon="🔗"
            onClick={() => setShowSignIn(true)}
          />
          <QuickActionCard
            title="Setup email automation"
            description="Automate your email workflows"
            icon="📧"
            onClick={() => setShowSignIn(true)}
          />
          <QuickActionCard
            title="Build API integration"
            description="Connect multiple services together"
            icon="🔄"
            onClick={() => setShowSignIn(true)}
          />
          <QuickActionCard
            title="Create custom workflow"
            description="Start from scratch with AI assistance"
            icon="✨"
            onClick={() => setShowSignIn(true)}
          />
        </div>


      </main>

      {/* Sign In Dialog */}
      {showSignIn && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 p-8 rounded-xl max-w-md w-full border border-zinc-800/50 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSignIn(false)}
                className="hover:text-blue-400"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {authView === 'signIn' ? <SignIn prompt={message} /> : <SignUp prompt={message} />}
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
          </div>
        </div>
      )}
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string
  description: string
  icon: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-zinc-900 p-6 rounded-xl text-left hover:bg-zinc-800/50 transition-colors border border-zinc-800/50 backdrop-blur">
        <div className="text-2xl mb-3">{icon}</div>
        <h3 className="font-medium mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-sm text-zinc-400">{description}</p>
        <ArrowRight className="h-4 w-4 text-zinc-600 absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 group-hover:text-blue-400 transition-all duration-300 transform group-hover:translate-x-1" />
      </div>
    </button>
  )
}

