import React, { useState } from 'react'
import { Scale, FileText } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { LogsViewer } from './LogsViewer'
import { Button } from './ui/button'

export function Header({ onLogoClick }) {
  const [showLogs, setShowLogs] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <button
            onClick={onLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
            aria-label="Start new chat"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary group-hover:scale-105 transition-transform">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Legal AI Assistant
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Get instant answers to your legal questions
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLogs(true)}
              className="gap-2 hidden sm:flex"
            >
              <FileText className="w-4 h-4" />
              View Logs
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowLogs(true)}
              className="sm:hidden"
            >
              <FileText className="w-4 h-4" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <LogsViewer isOpen={showLogs} onClose={() => setShowLogs(false)} />
    </>
  )
}
