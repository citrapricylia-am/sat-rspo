import { dbOperations } from './lib/db'
import { withMiddleware } from './lib/middleware'
import type { AuthenticatedRequest } from './lib/middleware'
import type { 
  CreateAssessmentRequest, 
  UpdateAssessmentRequest, 
  AssessmentResponse, 
  AssessmentListResponse,
  PaginationParams 
} from './types/database.js'
import type { VercelResponse } from '@vercel/node'

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const { method } = req
  
  try {
    switch (method) {
      case 'POST':
        return await handleCreateAssessment(req, res)
      case 'GET':
        return await handleGetAssessments(req, res)
      case 'PUT':
        return await handleUpdateAssessment(req, res)
      case 'DELETE':
        return await handleDeleteAssessment(req, res)
      default:
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`
        })
    }
  } catch (error: any) {
    console.error('Assessment handler error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

// POST /api/save-assessment - Create new assessment
const handleCreateAssessment = async (req: AuthenticatedRequest, res: VercelResponse) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }
    
    const { stage, answers_json, total_score, max_score, percentage }: CreateAssessmentRequest = req.body
    
    // Validate stage
    const validStages = ['pretest', 'stage1', 'stage2', 'stage3', 'final']
    if (!validStages.includes(stage)) {
      return res.status(400).json({
        success: false,
        error: `Invalid stage. Allowed stages: ${validStages.join(', ')}`
      })
    }
    
    // Validate scores
    if (total_score < 0 || max_score <= 0 || total_score > max_score) {
      return res.status(400).json({
        success: false,
        error: 'Invalid score values'
      })
    }
    
    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({
        success: false,
        error: 'Percentage must be between 0 and 100'
      })
    }
    
    // Validate answers_json structure
    if (!answers_json || typeof answers_json !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'answers_json must be a valid object'
      })
    }
    
    const assessmentData = {
      user_id: req.user.id,
      stage,
      answers_json,
      total_score,
      max_score,
      percentage
    }
    
    const assessment = await dbOperations.createAssessment(assessmentData)
    
    const response: AssessmentResponse = {
      success: true,
      message: 'Assessment saved successfully',
      data: assessment
    }
    
    return res.status(201).json(response)
    
  } catch (error: any) {
    console.error('Create assessment error:', error)
    return res.status(500).json({
      success: false,
      error: 'Error saving assessment'
    })
  }
}

// GET /api/save-assessment - Get assessments
const handleGetAssessments = async (req: AuthenticatedRequest, res: VercelResponse) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }
    
    const { id, stage, limit, offset } = req.query
    
    // Get specific assessment by ID
    if (id) {
      const assessment = await dbOperations.getAssessment(id as string)
      
      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: 'Assessment not found'
        })
      }
      
      // Check if user owns this assessment
      if (assessment.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        })
      }
      
      const response: AssessmentResponse = {
        success: true,
        data: assessment
      }
      
      return res.status(200).json(response)
    }
    
    // Get assessments by stage
    if (stage) {
      const validStages = ['pretest', 'stage1', 'stage2', 'stage3', 'final']
      if (!validStages.includes(stage as string)) {
        return res.status(400).json({
          success: false,
          error: `Invalid stage. Allowed stages: ${validStages.join(', ')}`
        })
      }
      
      const assessments = await dbOperations.getAssessmentsByStage(
        req.user.id, 
        stage as any
      )
      
      const response: AssessmentListResponse = {
        success: true,
        data: assessments
      }
      
      return res.status(200).json(response)
    }
    
    // Get all user assessments with pagination
    const limitNum = limit ? parseInt(limit as string) : 10
    const offsetNum = offset ? parseInt(offset as string) : 0
    
    const assessments = await dbOperations.getUserAssessments(
      req.user.id,
      limitNum,
      offsetNum
    )
    
    const response: AssessmentListResponse = {
      success: true,
      data: assessments
    }
    
    return res.status(200).json(response)
    
  } catch (error: any) {
    console.error('Get assessments error:', error)
    return res.status(500).json({
      success: false,
      error: 'Error retrieving assessments'
    })
  }
}

// PUT /api/save-assessment?id={id} - Update assessment
const handleUpdateAssessment = async (req: AuthenticatedRequest, res: VercelResponse) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }
    
    const { id } = req.query
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Assessment ID is required'
      })
    }
    
    // Check if assessment exists and belongs to user
    const existingAssessment = await dbOperations.getAssessment(id as string)
    
    if (!existingAssessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      })
    }
    
    if (existingAssessment.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }
    
    const { answers_json, total_score, max_score, percentage, completed_at }: UpdateAssessmentRequest = req.body
    
    const updates: UpdateAssessmentRequest = {}
    
    if (answers_json !== undefined) {
      if (!answers_json || typeof answers_json !== 'object') {
        return res.status(400).json({
          success: false,
          error: 'answers_json must be a valid object'
        })
      }
      updates.answers_json = answers_json
    }
    
    if (total_score !== undefined) {
      if (total_score < 0) {
        return res.status(400).json({
          success: false,
          error: 'total_score must be non-negative'
        })
      }
      updates.total_score = total_score
    }
    
    if (max_score !== undefined) {
      if (max_score <= 0) {
        return res.status(400).json({
          success: false,
          error: 'max_score must be positive'
        })
      }
      updates.max_score = max_score
    }
    
    if (percentage !== undefined) {
      if (percentage < 0 || percentage > 100) {
        return res.status(400).json({
          success: false,
          error: 'Percentage must be between 0 and 100'
        })
      }
      updates.percentage = percentage
    }
    
    if (completed_at !== undefined) {
      updates.completed_at = completed_at
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid updates provided'
      })
    }
    
    const updatedAssessment = await dbOperations.updateAssessment(id as string, updates)
    
    const response: AssessmentResponse = {
      success: true,
      message: 'Assessment updated successfully',
      data: updatedAssessment
    }
    
    return res.status(200).json(response)
    
  } catch (error: any) {
    console.error('Update assessment error:', error)
    return res.status(500).json({
      success: false,
      error: 'Error updating assessment'
    })
  }
}

// DELETE /api/save-assessment?id={id} - Delete assessment
const handleDeleteAssessment = async (req: AuthenticatedRequest, res: VercelResponse) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }
    
    const { id } = req.query
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Assessment ID is required'
      })
    }
    
    // Check if assessment exists and belongs to user
    const assessment = await dbOperations.getAssessment(id as string)
    
    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: 'Assessment not found'
      })
    }
    
    if (assessment.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      })
    }
    
    await dbOperations.deleteAssessment(id as string)
    
    return res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully'
    })
    
  } catch (error: any) {
    console.error('Delete assessment error:', error)
    return res.status(500).json({
      success: false,
      error: 'Error deleting assessment'
    })
  }
}

export default withMiddleware(handler, {
  requireAuth: true,
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  rateLimit: { maxRequests: 50, windowMs: 60000 } // 50 requests per minute
})
  