import { createServer } from 'http'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Start Vite dev server
console.log('🚀 Starting Vite development server...')
const viteProcess = spawn('npm', ['run', 'dev:frontend'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
})

// Simple API server
const server = createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }
  
  if (req.url?.startsWith('/api/')) {
    try {
      const apiPath = req.url.replace('/api/', '')
      const handlerPath = resolve(__dirname, 'api', `${apiPath}.js`)
      
      console.log(`API Request: ${req.method} ${req.url}`)
      
      // For development, we'll use dynamic import
      const { default: handler } = await import(handlerPath)
      
      // Collect request body
      let body = ''
      req.on('data', chunk => {
        body += chunk.toString()
      })
      
      req.on('end', async () => {
        try {
          // Parse JSON body if present
          if (body) {
            req.body = JSON.parse(body)
          }
          
          await handler(req, res)
        } catch (error) {
          console.error('API Handler Error:', error)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Internal server error' }))
        }
      })
      
    } catch (error) {
      console.error('API Import Error:', error)
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'API endpoint not found' }))
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not found' }))
  }
})

const API_PORT = 3001
server.listen(API_PORT, () => {
  console.log(`📡 API server running at http://localhost:${API_PORT}`)
  console.log(`🌐 Frontend will be available at http://localhost:5173`)
  console.log(``)
  console.log(`To test API: http://localhost:${API_PORT}/api/register`)
  console.log(``)
  console.log(`Press Ctrl+C to stop both servers`)
})

process.on('SIGINT', () => {
  console.log('\\n🛑 Shutting down servers...')
  viteProcess.kill()
  server.close()
  process.exit()
})