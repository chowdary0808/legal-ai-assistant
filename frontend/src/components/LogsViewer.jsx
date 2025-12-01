import React, { useState, useEffect } from 'react'
import { X, Clock, TrendingUp, Database, RefreshCw, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { getLogs, getStats } from '../services/api'

export function LogsViewer({ isOpen, onClose }) {
  const [logs, setLogs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const limit = 20

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const [logsData, statsData] = await Promise.all([
        getLogs({ limit, offset: page * limit }),
        getStats()
      ])
      setLogs(logsData.logs)
      setTotalCount(logsData.count)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchLogs()
    }
  }, [isOpen, page])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalPages = Math.ceil(totalCount / limit)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-6xl max-h-[90vh] bg-card rounded-3xl shadow-2xl border border-border/50 overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="relative border-b border-border/50 bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Query Logs & Analytics
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Track all user interactions and system performance
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                <div className="p-4 rounded-2xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Database className="w-4 h-4" />
                    <span className="text-xs font-medium">Total Queries</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.total_queries}</p>
                </div>
                <div className="p-4 rounded-2xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-medium">Avg Time</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.avg_processing_time}s</p>
                </div>
                <div className="p-4 rounded-2xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">Avg Similarity</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.avg_similarity}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-background/50 border border-border/50">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Database className="w-4 h-4" />
                    <span className="text-xs font-medium">Total FAQs</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.total_faqs}</p>
                </div>
              </div>
            )}
          </div>

          {/* Logs Table */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Database className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">No logs yet</p>
                <p className="text-sm">Start asking questions to see logs here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{log.id}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(log.created_at)}
                          </span>
                          {log.ip_address && (
                            <span className="text-xs text-muted-foreground">
                              IP: {log.ip_address}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          Q: {log.question}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          A: {log.answer}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {log.processing_time}s
                        </Badge>
                        {log.avg_similarity && (
                          <Badge variant="secondary" className="text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {log.avg_similarity}%
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {log.source_count} sources
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Pagination */}
          <div className="border-t border-border/50 p-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {page * limit + 1} - {Math.min((page + 1) * limit, totalCount)} of {totalCount} logs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0 || loading}
                  className="gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground px-3">
                  Page {page + 1} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1 || loading}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchLogs}
                  disabled={loading}
                  className="gap-1 ml-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
