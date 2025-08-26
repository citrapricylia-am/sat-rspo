import { supabase } from './supabase-config.ts'

/**
 * Insert new assessment data
 * @param {Object} assessmentData - Assessment form data
 * @returns {Object} Insert result
 */
export const insertAssessment = async (assessmentData) => {
  try {
    console.log('🔄 Inserting assessment data...')
    console.log('📝 Data:', assessmentData)

    // Get current user to ensure they're authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('❌ User not authenticated:', userError?.message)
      return {
        success: false,
        error: 'User must be authenticated to insert assessment data',
        data: null
      }
    }

    // Prepare assessment data with user ID and timestamps
    const dataToInsert = {
      user_id: user.id,
      ...assessmentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Insert assessment data
    const { data, error } = await supabase
      .from('assessments')
      .insert([dataToInsert])
      .select()

    if (error) {
      console.error('❌ Assessment insert error:', error.message)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    console.log('✅ Assessment inserted successfully:', data)
    return {
      success: true,
      error: null,
      data: data[0]
    }

  } catch (error) {
    console.error('❌ Insert assessment error:', error.message)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

/**
 * Insert multiple indicators for an assessment
 * @param {string} assessmentId - Assessment ID
 * @param {Array} indicators - Array of indicator data
 * @returns {Object} Insert result
 */
export const insertIndicators = async (assessmentId, indicators) => {
  try {
    console.log('🔄 Inserting indicators...')
    console.log('🆔 Assessment ID:', assessmentId)
    console.log('📊 Indicators count:', indicators.length)

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('❌ User not authenticated:', userError?.message)
      return {
        success: false,
        error: 'User must be authenticated',
        data: null
      }
    }

    // Prepare indicators data
    const indicatorsToInsert = indicators.map(indicator => ({
      assessment_id: assessmentId,
      user_id: user.id,
      ...indicator,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    // Insert indicators
    const { data, error } = await supabase
      .from('assessment_indicators')
      .insert(indicatorsToInsert)
      .select()

    if (error) {
      console.error('❌ Indicators insert error:', error.message)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    console.log('✅ Indicators inserted successfully:', data.length, 'records')
    return {
      success: true,
      error: null,
      data: data
    }

  } catch (error) {
    console.error('❌ Insert indicators error:', error.message)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

/**
 * Fetch assessments for current user
 * @param {Object} options - Query options
 * @returns {Object} Fetch result
 */
export const getAssessments = async (options = {}) => {
  try {
    console.log('🔄 Fetching assessments...')
    console.log('⚙️ Options:', options)

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('❌ User not authenticated:', userError?.message)
      return {
        success: false,
        error: 'User must be authenticated',
        data: null
      }
    }

    // Build query
    let query = supabase
      .from('assessments')
      .select(`
        *,
        profiles(full_name, role),
        assessment_indicators(*)
      `)

    // Apply user filter (users can only see their own assessments unless they're managers)
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileData?.role !== 'manajer') {
      query = query.eq('user_id', user.id)
    }

    // Apply additional filters
    if (options.status) {
      query = query.eq('status', options.status)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending || false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Execute query
    const { data, error } = await query

    if (error) {
      console.error('❌ Assessments fetch error:', error.message)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    console.log('✅ Assessments fetched successfully:', data.length, 'records')
    return {
      success: true,
      error: null,
      data: data
    }

  } catch (error) {
    console.error('❌ Fetch assessments error:', error.message)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

/**
 * Get single assessment by ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Object} Fetch result
 */
export const getAssessmentById = async (assessmentId) => {
  try {
    console.log('🔄 Fetching assessment by ID:', assessmentId)

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('❌ User not authenticated:', userError?.message)
      return {
        success: false,
        error: 'User must be authenticated',
        data: null
      }
    }

    // Fetch assessment with related data
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        profiles(full_name, role),
        assessment_indicators(*)
      `)
      .eq('id', assessmentId)
      .single()

    if (error) {
      console.error('❌ Assessment fetch error:', error.message)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    // Check if user has permission to view this assessment
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileData?.role !== 'manajer' && data.user_id !== user.id) {
      console.error('❌ User not authorized to view this assessment')
      return {
        success: false,
        error: 'Not authorized to view this assessment',
        data: null
      }
    }

    console.log('✅ Assessment fetched successfully:', data.id)
    return {
      success: true,
      error: null,
      data: data
    }

  } catch (error) {
    console.error('❌ Fetch assessment error:', error.message)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

/**
 * Update assessment status
 * @param {string} assessmentId - Assessment ID
 * @param {string} status - New status
 * @returns {Object} Update result
 */
export const updateAssessmentStatus = async (assessmentId, status) => {
  try {
    console.log('🔄 Updating assessment status...')
    console.log('🆔 Assessment ID:', assessmentId)
    console.log('📊 New status:', status)

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('❌ User not authenticated:', userError?.message)
      return {
        success: false,
        error: 'User must be authenticated',
        data: null
      }
    }

    // Update assessment
    const { data, error } = await supabase
      .from('assessments')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', assessmentId)
      .eq('user_id', user.id) // Ensure user can only update their own assessments
      .select()

    if (error) {
      console.error('❌ Assessment update error:', error.message)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    if (data.length === 0) {
      console.error('❌ Assessment not found or not authorized')
      return {
        success: false,
        error: 'Assessment not found or not authorized to update',
        data: null
      }
    }

    console.log('✅ Assessment status updated successfully')
    return {
      success: true,
      error: null,
      data: data[0]
    }

  } catch (error) {
    console.error('❌ Update assessment error:', error.message)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

/**
 * Delete assessment
 * @param {string} assessmentId - Assessment ID
 * @returns {Object} Delete result
 */
export const deleteAssessment = async (assessmentId) => {
  try {
    console.log('🔄 Deleting assessment...')
    console.log('🆔 Assessment ID:', assessmentId)

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('❌ User not authenticated:', userError?.message)
      return {
        success: false,
        error: 'User must be authenticated',
        data: null
      }
    }

    // Delete assessment (this will cascade delete indicators if foreign key is set up)
    const { data, error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', assessmentId)
      .eq('user_id', user.id) // Ensure user can only delete their own assessments
      .select()

    if (error) {
      console.error('❌ Assessment delete error:', error.message)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }

    if (data.length === 0) {
      console.error('❌ Assessment not found or not authorized')
      return {
        success: false,
        error: 'Assessment not found or not authorized to delete',
        data: null
      }
    }

    console.log('✅ Assessment deleted successfully')
    return {
      success: true,
      error: null,
      data: data[0]
    }

  } catch (error) {
    console.error('❌ Delete assessment error:', error.message)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

export default {
  insertAssessment,
  insertIndicators,
  getAssessments,
  getAssessmentById,
  updateAssessmentStatus,
  deleteAssessment
}