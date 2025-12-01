import React, { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { getCategoryColor } from '../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function SourceCard({ source }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="glass hover:-translate-y-1 transition-all cursor-pointer overflow-hidden">
      <CardHeader
        className="p-4 pb-3 space-y-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={getCategoryColor(source.category)}>
                {source.category}
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {source.similarity_score}% match
              </Badge>
            </div>
            <h4 className="text-sm font-semibold leading-tight">
              {source.question}
            </h4>
          </div>

          <button
            className="flex-shrink-0 p-1 hover:bg-muted rounded-full transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent className="p-4 pt-0 border-t">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {source.answer}
              </p>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
