import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env.local') })

const app = express()
const PORT = 3001

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Simple API endpoint loader
const loadApiEndpoint = async (endpointName) => {
  try {
    const modulePath = resolve(__dirname, 'api', `${endpointName}.js`)
    const module = await import(modulePath)
    return module.default
  } catch (error) {
    console.error(`Failed to load API endpoint: ${endpointName}`, error)
    return null
  }
}

// Dynamic API route handler
app.use('/api/:endpoint', async (req, res) => {
  const { endpoint } = req.params
  
  console.log(`📡 API Request: ${req.method} /api/${endpoint}`)
  
  try {
    const handler = await loadApiEndpoint(endpoint)
    
    if (!handler) {
      return res.status(404).json({
        success: false,
        error: `API endpoint '${endpoint}' not found`
      })
    }
    
    // Call the API handler
    await handler(req, res)
    
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SAT RSPO PADI API Server is running',
    endpoints: [
      'POST /api/register',
      'POST /api/login', 
      'POST /api/logout',
      'GET /api/profile',
      'PUT /api/profile',
      'POST /api/save-assessment',
      'GET /api/save-assessment'
    ]
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 SAT RSPO PADI API Server running on http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/health`)
  console.log(`🌐 Supabase URL: ${process.env.SUPABASE_URL || 'Not configured'}`)
  console.log('')
  console.log('Available endpoints:')
  console.log('  POST /api/register - User registration')
  console.log('  POST /api/login - User login')
  console.log('  POST /api/logout - User logout')
  console.log('  GET /api/profile - Get user profile')
  console.log('  PUT /api/profile - Update user profile')
  console.log('  POST /api/save-assessment - Create assessment')
  console.log('  GET /api/save-assessment - List assessments')
  console.log('')
  console.log('🎯 Ready to receive requests from frontend!')
})