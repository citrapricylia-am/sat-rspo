// Simple development server to fix the 404 API error
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())

// Mock API endpoints for development
app.post('/api/register', (req, res) => {
  console.log('📝 Registration attempt:', req.body)
  
  // Simple validation
  const { email, password, full_name, role } = req.body
  
  if (!email || !password || !full_name || !role) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    })
  }
  
  if (!['petani', 'manajer'].includes(role)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid role. Must be petani or manajer'
    })
  }
  
  // Mock successful registration
  res.json({
    success: true,
    message: 'Registration successful',
    data: {
      id: Date.now(),
      email,
      full_name,
      role,
      created_at: new Date().toISOString()
    }
  })
})

app.post('/api/login', (req, res) => {
  console.log('🔐 Login attempt:', req.body)
  
  const { email, password } = req.body
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password required'
    })
  }
  
  // Mock successful login
  res.json({
    success: true,
    message: 'Login successful',
    data: {
      id: 1,
      email,
      full_name: 'Test User',
      role: 'petani',
      token: 'mock-jwt-token'
    }
  })
})

app.get('/api/profile', (req, res) => {
  res.json({
    success: true,
    data: {
      id: 1,
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'petani'
    }
  })
})

app.post('/api/save-assessment', (req, res) => {
  console.log('💾 Save assessment:', req.body)
  res.json({
    success: true,
    message: 'Assessment saved',
    data: { id: Date.now() }
  })
})

// Serve static files from dist directory after build
app.use(express.static(path.join(__dirname, 'dist')))

// Handle React routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Development Server running on http://localhost:${PORT}`)
  console.log(`📡 API endpoints available:`)
  console.log(`   POST http://localhost:${PORT}/api/register`)
  console.log(`   POST http://localhost:${PORT}/api/login`)
  console.log(`   GET  http://localhost:${PORT}/api/profile`)
  console.log(`   POST http://localhost:${PORT}/api/save-assessment`)
  console.log(``)
  console.log(`⚠️  This is a development server with mock API responses`)
  console.log(`   For production, deploy to Vercel with real Supabase integration`)
  console.log(``)
  console.log(`Next steps:`)
  console.log(`1. Build frontend: npm run build`)
  console.log(`2. Test registration at http://localhost:${PORT}`)
})