import React, { useState, useRef, useEffect } from 'react'
import { SendHorizontal, Loader2, Sparkles } from 'lucide-react'
import { Button } from './ui/button'

export function InputArea({ onSend, loading, disabled }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [input])

  // Auto-focus on mount
  useEffect(() => {
    if (textareaRef.current && !loading) {
      textareaRef.current.focus()
    }
  }, [loading])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !loading && !disabled) {
      onSend(input)
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="container max-w-4xl mx-auto p-4 md:p-6">
        <form onSubmit={handleSubmit} className="relative">
          {/* Enhanced Input Container */}
          <div className="relative flex items-end gap-3 bg-gradient-to-br from-muted/50 to-muted/30 rounded-3xl p-3 border-2 border-border/50 focus-within:border-primary/50 focus-within:shadow-lg focus-within:shadow-primary/10 transition-all duration-300">
            {/* Sparkle Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex-shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about legal matters..."
              disabled={loading || disabled}
              className="flex-1 bg-transparent resize-none outline-none px-2 py-2 text-base min-h-[44px] max-h-[120px] placeholder:text-muted-foreground/60 disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
            />

            {/* Send Button */}
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || loading || disabled}
              className="rounded-2xl w-12 h-12 flex-shrink-0 bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-white" />
              ) : (
                <SendHorizontal className="w-6 h-6 text-white" />
              )}
            </Button>
          </div>

          {/* Hint Text */}
          <div className="flex items-center justify-between mt-3 px-2">
            <p className="text-xs text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-semibold">Enter</kbd> to send • <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-semibold">Shift + Enter</kbd> for new line
            </p>
            {input.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {input.length} characters
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
