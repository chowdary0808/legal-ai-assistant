import { useState } from 'react'
import { askQuestion } from '../services/api'
import { useLocalStorage } from './useLocalStorage'

export function useChat() {
  const [messages, setMessages] = useLocalStorage('legal-qa-messages', [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = async (text) => {
    if (!text.trim()) {
      setError('Please enter a question')
      return
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)
    setError(null)

    try {
      // Call API
      const response = await askQuestion(text)

      // Add AI response with user's question attached
      const aiMessage = {
        id: Date.now() + 1,
        text: response.answer,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        sources: response.sources || [],
        processingTime: response.processing_time,
        userQuestion: text.trim(), // Attach the user's question
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error('Error sending message:', err)
      setError(err.message || 'Failed to get response. Please try again.')

      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: 'I apologize, but I encountered an error processing your question. Please try again.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true,
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
  }

  const sendExampleQuestion = (question) => {
    sendMessage(question)
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearChat,
    sendExampleQuestion,
  }
}
