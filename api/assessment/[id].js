/**
 * GET /api/assessment/[id]
 * 
 * Retrieve assessment by ID
 * Requires authentication
 * Users can only access their own assessments unless they have 'manajer' role
 * 
 * URL Parameters:
 * - id: Assessment UUID
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "assessment": { ... },
 *     "indicators": [ ... ], // Optional: assessment indicators
 *     "user": { ... } // Basic user info for managers
 *   },
 *   "message": "Assessment retrieved successfully"
 * }
 */

import { supabase } from '../../../lib/supabaseClient.js';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  isValidUUID
} from '../../../lib/utils.js';
import { withApiMiddleware, withAuth } from '../../../lib/middleware.js';

async function assessmentGetHandler(req, res) {
  const { id } = req.query;
  
  // Validate UUID format
  if (!id || !isValidUUID(id)) {
    const { response, status } = createErrorResponse(
      'Invalid assessment ID format', 
      400
    );
    return res.status(status).json(response);
  }

  try {
    // Get authenticated user from middleware
    const currentUser = req.user;
    
    if (!currentUser) {
      const { response, status } = createErrorResponse(
        'Authentication required', 
        401
      );
      return res.status(status).json(response);
    }

    // Get current user's profile to check role
    const { data: currentUserProfile, error: currentUserError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    if (currentUserError) {
      console.error('Error fetching current user profile:', currentUserError);
      const { response, status } = createErrorResponse(
        'Failed to verify user permissions', 
        500
      );
      return res.status(status).json(response);
    }

    // Fetch the assessment
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('assessments')
      .select(`
        id,
        user_id,
        title,
        description,
        assessment_type,
        status,
        score,
        metadata,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single();

    if (assessmentError || !assessmentData) {
      console.error('Assessment retrieval error:', assessmentError);
      const { response, status } = createErrorResponse(
        'Assessment not found', 
        404
      );
      return res.status(status).json(response);
    }

    // Check if user can access this assessment
    const isOwnAssessment = currentUser.id === assessmentData.user_id;
    const isManager = currentUserProfile?.role === 'manajer';
    
    if (!isOwnAssessment && !isManager) {
      const { response, status } = createErrorResponse(
        'Access denied. You can only view your own assessments', 
        403
      );
      return res.status(status).json(response);
    }

    // Get assessment indicators if they exist
    const { data: indicatorsData, error: indicatorsError } = await supabase
      .from('assessment_indicators')
      .select(`
        id,
        indicator_name,
        value,
        score,
        notes,
        created_at,
        updated_at
      `)
      .eq('assessment_id', id)
      .order('created_at', { ascending: true });

    let indicators = [];
    if (!indicatorsError && indicatorsData) {
      indicators = indicatorsData;
    }

    // Get basic user info if manager is viewing someone else's assessment
    let userInfo = null;
    if (isManager && !isOwnAssessment) {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          phone,
          address,
          role,
          created_at
        `)
        .eq('id', assessmentData.user_id)
        .single();

      if (!userError && userData) {
        userInfo = userData;
      }
    }

    // Prepare response data
    const responseData = {
      assessment: {
        id: assessmentData.id,
        user_id: assessmentData.user_id,
        title: assessmentData.title,
        description: assessmentData.description,
        assessment_type: assessmentData.assessment_type,
        status: assessmentData.status,
        score: assessmentData.score,
        metadata: assessmentData.metadata,
        created_at: assessmentData.created_at,
        updated_at: assessmentData.updated_at
      },
      ...(indicators.length > 0 && { indicators }),
      ...(userInfo && { user: userInfo })
    };

    const { response, status } = createSuccessResponse(
      responseData,
      'Assessment retrieved successfully',
      200
    );
    
    return res.status(status).json(response);

  } catch (error) {
    console.error('Assessment retrieval error:', error);
    const { response, status } = createErrorResponse(
      'Internal server error', 
      500
    );
    return res.status(status).json(response);
  }
}

// Apply middleware and export
export default withApiMiddleware(['GET'])(withAuth(assessmentGetHandler));