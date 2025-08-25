import { dbOperations } from './lib/db.js'
import { withMiddleware } from './lib/middleware.js'
import type { AuthenticatedRequest } from './lib/middleware.js'
import type { LoginHistoryResponse } from './types/database.js'
import type { VercelResponse } from '@vercel/node'

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const { method } = req
  
  try {
    switch (method) {
      case 'GET':
        return await handleGetStats(req, res)
      default:
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`
        })
    }
  } catch (error: any) {
    console.error('User stats handler error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

// GET /api/user-stats - Get user statistics and login history
const handleGetStats = async (req: AuthenticatedRequest, res: VercelResponse) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }
    
    const { type, limit } = req.query
    
    if (type === 'login-history') {
      // Get login history
      const limitNum = limit ? parseInt(limit as string) : 10
      const loginHistory = await dbOperations.getUserLoginHistory(req.user.id, limitNum)
      
      const response: LoginHistoryResponse = {
        success: true,
        data: loginHistory
      }
      
      return res.status(200).json(response)
    }
    
    if (type === 'assessments' || !type) {
      // Get assessment statistics
      const stats = await dbOperations.getUserAssessmentStats(req.user.id)
      
      return res.status(200).json({
        success: true,
        data: stats
      })
    }
    
    if (type === 'all') {
      // Get all statistics
      const [assessmentStats, loginHistory] = await Promise.all([
        dbOperations.getUserAssessmentStats(req.user.id),
        dbOperations.getUserLoginHistory(req.user.id, 5) // Last 5 logins
      ])
      
      return res.status(200).json({
        success: true,
        data: {
          assessments: assessmentStats,
          recent_logins: loginHistory
        }
      })
    }
    
    return res.status(400).json({
      success: false,
      error: 'Invalid type parameter. Use: assessments, login-history, or all'
    })
    
  } catch (error: any) {
    console.error('Get user stats error:', error)
    return res.status(500).json({
      success: false,
      error: 'Error retrieving user statistics'
    })
  }
}

export default withMiddleware(handler, {
  requireAuth: true,
  allowedMethods: ['GET'],
  rateLimit: { maxRequests: 30, windowMs: 60000 } // 30 requests per minute
})