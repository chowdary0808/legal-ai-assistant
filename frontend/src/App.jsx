import React, { useRef } from 'react'
import { Header } from './components/Header'
import { ChatInterface } from './components/ChatInterface'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const clearChatRef = useRef(null)

  const handleLogoClick = () => {
    if (clearChatRef.current) {
      clearChatRef.current()
    }
  }

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Header onLogoClick={handleLogoClick} />
        <ChatInterface clearChatRef={clearChatRef} />
      </div>
    </ThemeProvider>
  )
}

export default App
