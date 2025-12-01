import React from 'react'
import { Bot, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="relative rounded-3xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-lg overflow-hidden">
        {/* Gradient Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-pulse"></div>

        <div className="p-6 md:p-8">
          {/* Header with Avatar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary shadow-lg animate-pulse">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="h-5 w-48 bg-muted-foreground/20 rounded animate-pulse"></div>
                <Sparkles className="w-4 h-4 text-secondary/70 animate-pulse" />
              </div>
              <div className="h-3 w-24 bg-muted-foreground/10 rounded mt-1 animate-pulse"></div>
            </div>
          </div>

          {/* Loading Content */}
          <div className="space-y-3">
            <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-11/12"></div>
            <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-10/12"></div>
            <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-9/12"></div>
          </div>

          {/* Typing indicator */}
          <div className="flex items-center gap-2 mt-6">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-primary to-secondary rounded-full typing-dot"></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-primary to-secondary rounded-full typing-dot"></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-primary to-secondary rounded-full typing-dot"></div>
            </div>
            <span className="text-sm text-muted-foreground font-medium">AI is thinking...</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
