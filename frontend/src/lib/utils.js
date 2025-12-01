import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(date) {
  const now = new Date()
  const messageDate = new Date(date)
  const diffInSeconds = Math.floor((now - messageDate) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`

  return messageDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function getCategoryColor(category) {
  const colors = {
    'Civil Law': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'Intellectual Property': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    'Employment Law': 'bg-green-500/10 text-green-600 dark:text-green-400',
    'Real Estate Law': 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    'Personal Injury': 'bg-red-500/10 text-red-600 dark:text-red-400',
    'Bankruptcy Law': 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    'Estate Planning': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    'Business Law': 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    'Criminal Law': 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    'Contract Law': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    'Family Law': 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  }

  return colors[category] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
}
