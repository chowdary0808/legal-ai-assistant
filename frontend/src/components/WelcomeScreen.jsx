import React from 'react'
import { Scale, Sparkles, Zap, BookOpen, Target, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from './ui/badge'

const exampleQuestions = [
  { text: "How long do I have to file a lawsuit?", category: "Civil Law" },
  { text: "Can I protect my business logo?", category: "IP Law" },
  { text: "Do I get overtime if I work 50 hours?", category: "Employment" },
  { text: "What to do after a car accident?", category: "Personal Injury" },
  { text: "How do I form an LLC?", category: "Business Law" },
  { text: "What are my rights if arrested?", category: "Criminal Law" }
]

export function WelcomeScreen({ onExampleClick }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full text-center space-y-10"
      >
        {/* Hero Section */}
        <div className="space-y-6">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="relative inline-block"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center shadow-2xl shadow-primary/30">
              <Scale className="w-12 h-12 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-secondary animate-pulse" />
            <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
          </motion.div>

          {/* Heading */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
            >
              Your Legal AI Assistant
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground font-medium"
            >
              Get instant, accurate answers to your legal questions
            </motion.p>
          </div>
        </div>

        {/* Example Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <p className="text-base font-semibold text-foreground">
              Popular Questions
            </p>
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {exampleQuestions.map((item, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                onClick={() => onExampleClick(item.text)}
                className="group relative p-4 rounded-2xl bg-gradient-to-br from-card to-card/50 border-2 border-border/50 hover:border-primary/50 transition-all duration-300 text-left hover:shadow-lg hover:shadow-primary/10"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {item.category}
                    </Badge>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.text}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto"
        >
          <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Instant Answers</h3>
            <p className="text-sm text-muted-foreground text-center">
              Get responses in 1-3 seconds
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Trusted Sources</h3>
            <p className="text-sm text-muted-foreground text-center">
              Backed by verified legal FAQs
            </p>
          </div>
          <div className="flex flex-col items-center space-y-3 p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/10 border border-primary/20">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-lg">Accurate Info</h3>
            <p className="text-sm text-muted-foreground text-center">
              AI-powered legal insights
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
