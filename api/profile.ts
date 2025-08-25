import { dbOperations } from './lib/db.js'
import { withMiddleware, isValidEmail } from './lib/middleware.js'
import type { AuthenticatedRequest } from './lib/middleware.js'
import type { UpdateProfileRequest, ProfileResponse } from './types/database.js'
import type { VercelResponse } from '@vercel/node'

const handler = async (req: AuthenticatedRequest, res: VercelResponse) => {
  const { method } = req
  
  try {
    switch (method) {
      case 'GET':
        return await handleGetProfile(req, res)
      case 'PUT':
        return await handleUpdateProfile(req, res)
      default:
        return res.status(405).json({
          success: false,
          error: `Method ${method} not allowed`
        })
    }
  } catch (error: any) {
    console.error('Profile handler error:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}

// GET /api/profile - Get current user's profile
const handleGetProfile = async (req: AuthenticatedRequest, res: VercelResponse) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }
    
    const profile = await dbOperations.getUserProfile(req.user.id)
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      })
    }
    
    const response: ProfileResponse = {
      success: true,
      data: profile
    }
    
    return res.status(200).json(response)
    
  } catch (error: any) {
    console.error('Get profile error:', error)
    return res.status(500).json({
      success: false,
      error: 'Error retrieving profile'
    })
  }
}

// PUT /api/profile - Update current user's profile
const handleUpdateProfile = async (req: AuthenticatedRequest, res: VercelResponse) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }
    
    const { full_name, phone, address, role, avatar_url }: UpdateProfileRequest = req.body
    
    // Validate input data
    const updates: Partial<UpdateProfileRequest> = {}
    
    if (full_name !== undefined) {
      if (!full_name || full_name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Full name cannot be empty'
        })
      }
      updates.full_name = full_name.trim()
    }
    
    if (phone !== undefined) {
      if (!phone || phone.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Phone cannot be empty'
        })
      }
      updates.phone = phone.trim()
    }
    
    if (address !== undefined) {
      if (!address || address.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Address cannot be empty'
        })
      }
      updates.address = address.trim()
    }
    
    if (role !== undefined) {
      const validRoles = ['petani', 'manajer']
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          error: `Invalid role. Allowed roles: ${validRoles.join(', ')}`
        })
      }
      updates.role = role
    }
    
    if (avatar_url !== undefined) {
      updates.avatar_url = avatar_url
    }
    
    // Check if there are any updates to apply
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid updates provided'
      })
    }
    
    // Update the profile
    const updatedProfile = await dbOperations.updateUserProfile(req.user.id, updates)
    
    const response: ProfileResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile
    }
    
    return res.status(200).json(response)
    
  } catch (error: any) {
    console.error('Update profile error:', error)
    
    // Handle specific database errors
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      })
    }
    
    return res.status(500).json({
      success: false,
      error: 'Error updating profile'
    })
  }
}

export default withMiddleware(handler, {
  requireAuth: true,
  allowedMethods: ['GET', 'PUT'],
  rateLimit: { maxRequests: 30, windowMs: 60000 } // 30 requests per minute
})