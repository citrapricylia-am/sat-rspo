import express from 'express'
import { createServer as createViteServer } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env.local') })

async function createServer() {
  const app = express()
  
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  })
  
  app.use(vite.ssrFixStacktrace)
  
  // Handle API routes
  app.use('/api', async (req, res, next) => {
    try {
      const apiPath = resolve(__dirname, `api${req.path}.ts`)
      console.log(`API Request: ${req.method} ${req.path}`)
      
      // Import and execute the API handler
      const { default: handler } = await vite.ssrLoadModule(apiPath)
      
      if (handler) {
        await handler(req, res)
      } else {
        res.status(404).json({ error: 'API endpoint not found' })
      }
    } catch (error) {
      console.error('API Error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  })
  
  // Use Vite's connect instance as middleware
  app.use(vite.middlewares)
  
  const port = 3000
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`)
    console.log(`📡 API endpoints available at http://localhost:${port}/api/*`)
    console.log(`🌐 Frontend available at http://localhost:${port}`)
  })
}

createServer().catch(console.error)