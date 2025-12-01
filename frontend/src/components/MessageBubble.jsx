import React from 'react'
import { Bot, Clock, Sparkles, MessageSquare } from 'lucide-react'
import { SourceCard } from './SourceCard'
import { formatTimestamp } from '../lib/utils'
import { motion } from 'framer-motion'

export function MessageBubble({ message, isUser }) {
  // Don't render user messages - only show AI responses
  if (isUser) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full group"
    >
      {/* AI Response Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>

        <div className="p-6 md:p-8">
          {/* Header with Avatar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Legal AI Assistant
                </h3>
                <Sparkles className="w-4 h-4 text-secondary/70" />
              </div>
              <p className="text-xs text-muted-foreground">
                {formatTimestamp(message.timestamp)}
              </p>
            </div>
            {message.processingTime && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span>{message.processingTime}s</span>
              </div>
            )}
          </div>

          {/* User's Question (if available) */}
          {message.userQuestion && (
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary/80 mb-1">Your Question</p>
                  <p className="text-sm font-medium text-foreground/90">
                    {message.userQuestion}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Answer Content */}
          <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
            <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words text-foreground">
              {message.text}
            </p>
          </div>

          {/* Sources Section */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                <h4 className="text-sm font-semibold text-foreground">
                  Sources & References ({message.sources.length})
                </h4>
              </div>
              <div className="grid gap-3">
                {message.sources.map((source, index) => (
                  <SourceCard key={index} source={source} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
