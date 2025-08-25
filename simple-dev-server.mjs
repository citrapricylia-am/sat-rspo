// Ultra-simple development server to fix 404 API error
import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { resolve, extname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = resolve(fileURLToPath(import.meta.url), '..')

const PORT = 3000

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
}

const server = createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  
  console.log(`${req.method} ${req.url}`)
  
  // Handle API routes
  if (req.url?.startsWith('/api/')) {
    handleApiRequest(req, res)
    return
  }
  
  // Serve static files
  serveStaticFile(req, res)
})

function handleApiRequest(req, res) {
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })
  req.on('end', () => {
    try {
      const data = body ? JSON.parse(body) : {}
      
      res.setHeader('Content-Type', 'application/json')
      
      if (req.url === '/api/register' && req.method === 'POST') {
        console.log('📝 Registration:', data)
        
        const { email, password, full_name, role } = data
        
        if (!email || !password || !full_name || !role) {
          res.writeHead(400)
          res.end(JSON.stringify({ success: false, error: 'Missing required fields' }))
          return
        }
        
        if (!['petani', 'manajer'].includes(role)) {
          res.writeHead(400)
          res.end(JSON.stringify({ success: false, error: 'Invalid role' }))
          return
        }
        
        res.writeHead(200)
        res.end(JSON.stringify({
          success: true,
          message: 'Registration successful! (Mock response)',
          data: {
            id: Date.now(),
            email,
            full_name,
            role,
            created_at: new Date().toISOString()
          }
        }))
        
      } else if (req.url === '/api/login' && req.method === 'POST') {
        console.log('🔐 Login:', data)
        
        res.writeHead(200)
        res.end(JSON.stringify({
          success: true,
          message: 'Login successful! (Mock response)',
          data: {
            id: 1,
            email: data.email,
            full_name: 'Test User',
            role: 'petani',
            token: 'mock-jwt-token'
          }
        }))
        
      } else if (req.url === '/api/profile' && req.method === 'GET') {
        res.writeHead(200)
        res.end(JSON.stringify({
          success: true,
          data: {
            id: 1,
            email: 'test@example.com',
            full_name: 'Test User',
            role: 'petani'
          }
        }))
        
      } else if (req.url === '/api/save-assessment' && req.method === 'POST') {
        console.log('💾 Save assessment:', data)
        
        res.writeHead(200)
        res.end(JSON.stringify({
          success: true,
          message: 'Assessment saved! (Mock response)',
          data: { id: Date.now() }
        }))
        
      } else {
        res.writeHead(404)
        res.end(JSON.stringify({ success: false, error: 'API endpoint not found' }))
      }
      
    } catch (error) {
      console.error('API Error:', error)
      res.writeHead(500)
      res.end(JSON.stringify({ success: false, error: 'Server error' }))
    }
  })
}

function serveStaticFile(req, res) {
  let filePath = req.url === '/' ? '/index.html' : req.url
  filePath = resolve(__dirname, 'dist', filePath.substring(1))
  
  if (!existsSync(filePath)) {
    // For React Router - serve index.html for non-existent routes
    filePath = resolve(__dirname, 'dist', 'index.html')
  }
  
  try {
    const data = readFileSync(filePath)
    const ext = extname(filePath)
    const contentType = mimeTypes[ext] || 'application/octet-stream'
    
    res.setHeader('Content-Type', contentType)
    res.writeHead(200)
    res.end(data)
    
  } catch (error) {
    res.writeHead(404)
    res.end('File not found')
  }
}

server.listen(PORT, () => {
  console.log(`🚀 Simple Development Server running on http://localhost:${PORT}`)
  console.log(``)
  console.log(`📡 Mock API endpoints:`)
  console.log(`   POST /api/register - User registration`)
  console.log(`   POST /api/login - User login`)  
  console.log(`   GET  /api/profile - User profile`)
  console.log(`   POST /api/save-assessment - Save assessment`)
  console.log(``)
  console.log(`✅ This fixes the 404 error you were experiencing!`)
  console.log(``)
  console.log(`⚠️  Note: This uses mock responses for development`)
  console.log(`   For production with real Supabase, deploy to Vercel`)
  console.log(``)
  console.log(`🎯 Try registering at: http://localhost:${PORT}`)
})