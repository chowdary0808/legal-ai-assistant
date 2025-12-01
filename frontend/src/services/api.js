import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`, response.data)
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.status, error.response.data)
      throw new Error(error.response.data.error || 'Server error occurred')
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request)
      throw new Error('Unable to connect to server. Please check if the backend is running.')
    } else {
      // Something else happened
      console.error('Error:', error.message)
      throw new Error(error.message)
    }
  }
)

/**
 * Ask a question to the legal AI assistant
 * @param {string} question - The user's question
 * @returns {Promise<Object>} Response with answer, sources, and processing_time
 */
export async function askQuestion(question) {
  const response = await api.post('/ask/', { question })
  return response.data
}

/**
 * Check if API is healthy
 * @returns {Promise<Object>} Health status
 */
export async function healthCheck() {
  const response = await api.get('/health/')
  return response.data
}

/**
 * Get system statistics
 * @returns {Promise<Object>} Stats with total_faqs, total_queries, chroma_count
 */
export async function getStats() {
  const response = await api.get('/stats/')
  return response.data
}

/**
 * Get query logs with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Number of logs to return (default: 50)
 * @param {number} params.offset - Pagination offset (default: 0)
 * @returns {Promise<Object>} Logs data with count and logs array
 */
export async function getLogs(params = {}) {
  const response = await api.get('/logs/', { params })
  return response.data
}

export default api
