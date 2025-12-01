import React, { useRef, useEffect } from 'react'
import { MessageBubble } from './MessageBubble'
import { InputArea } from './InputArea'
import { LoadingSkeleton } from './LoadingSkeleton'
import { WelcomeScreen } from './WelcomeScreen'
import { Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import { useChat } from '../hooks/useChat'

export function ChatInterface({ clearChatRef }) {
  const { messages, loading, sendMessage, sendExampleQuestion, clearChat } = useChat()
  const messagesEndRef = useRef(null)

  // Expose clearChat function to parent via ref
  useEffect(() => {
    if (clearChatRef) {
      clearChatRef.current = clearChat
    }
  }, [clearChat, clearChatRef])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, loading])

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <WelcomeScreen onExampleClick={sendExampleQuestion} />
          ) : (
            <>
              {/* Clear Chat Button */}
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearChat}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Chat
                </Button>
              </div>

              {/* Messages */}
              <div className="space-y-6 pb-4">
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isUser={message.sender === 'user'}
                  />
                ))}

                {/* Loading Skeleton */}
                {loading && <LoadingSkeleton />}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <InputArea onSend={sendMessage} loading={loading} />
    </div>
  )
}
