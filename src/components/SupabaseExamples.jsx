/**
 * React Component Examples for Supabase Integration
 * 
 * This file shows how to use the Supabase functions in React components
 * Copy these examples into your actual React components
 */

import React, { useState, useEffect } from 'react'
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../lib/auth.js'
import { insertAssessment, getAssessments } from '../lib/data.js'

// Example 1: Login Form Component
export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await loginUser(email, password)
      
      if (result.success) {
        console.log('Login successful:', result.data.user.email)
        // Redirect or update app state
        window.location.href = '/dashboard'
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Login failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      {error && <div style={{color: 'red'}}>{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

// Example 2: Registration Form Component
export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'petani'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const result = await registerUser(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role
      )
      
      if (result.success) {
        setSuccess(true)
        console.log('Registration successful:', result.data.user.email)
        // You might want to auto-login or redirect
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Registration failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>Password:</label>
        <input 
          type="password" 
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>Full Name:</label>
        <input 
          type="text" 
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>Role:</label>
        <select 
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="petani">Petani</option>
          <option value="manajer">Manajer</option>
        </select>
      </div>
      
      {error && <div style={{color: 'red'}}>{error}</div>}
      {success && <div style={{color: 'green'}}>Registration successful!</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}

// Example 3: Assessment Form Component
export function AssessmentForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assessmentType: 'sustainability',
    indicators: [
      { indicator_name: '', value: '', score: 0, notes: '' }
    ]
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const assessmentData = {
        title: formData.title,
        description: formData.description,
        status: 'draft',
        assessment_type: formData.assessmentType,
        score: 0, // Calculate based on indicators
        metadata: {
          indicators_count: formData.indicators.length
        }
      }

      const result = await insertAssessment(assessmentData)
      
      if (result.success) {
        setSuccess(true)
        console.log('Assessment saved:', result.data.id)
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          assessmentType: 'sustainability',
          indicators: [{ indicator_name: '', value: '', score: 0, notes: '' }]
        })
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Save failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const addIndicator = () => {
    setFormData({
      ...formData,
      indicators: [
        ...formData.indicators,
        { indicator_name: '', value: '', score: 0, notes: '' }
      ]
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Assessment Title:</label>
        <input 
          type="text" 
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>Description:</label>
        <textarea 
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        />
      </div>
      
      <div>
        <label>Assessment Type:</label>
        <select 
          name="assessmentType"
          value={formData.assessmentType}
          onChange={handleChange}
        >
          <option value="sustainability">Sustainability</option>
          <option value="environmental">Environmental</option>
          <option value="social">Social</option>
        </select>
      </div>
      
      <div>
        <h4>Indicators:</h4>
        {formData.indicators.map((indicator, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px 0' }}>
            <input 
              type="text"
              placeholder="Indicator Name"
              value={indicator.indicator_name}
              onChange={(e) => {
                const newIndicators = [...formData.indicators]
                newIndicators[index].indicator_name = e.target.value
                setFormData({ ...formData, indicators: newIndicators })
              }}
            />
            <input 
              type="text"
              placeholder="Value"
              value={indicator.value}
              onChange={(e) => {
                const newIndicators = [...formData.indicators]
                newIndicators[index].value = e.target.value
                setFormData({ ...formData, indicators: newIndicators })
              }}
            />
            <input 
              type="number"
              placeholder="Score"
              value={indicator.score}
              onChange={(e) => {
                const newIndicators = [...formData.indicators]
                newIndicators[index].score = parseInt(e.target.value) || 0
                setFormData({ ...formData, indicators: newIndicators })
              }}
            />
          </div>
        ))}
        <button type="button" onClick={addIndicator}>Add Indicator</button>
      </div>
      
      {error && <div style={{color: 'red'}}>{error}</div>}
      {success && <div style={{color: 'green'}}>Assessment saved successfully!</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Assessment'}
      </button>
    </form>
  )
}

// Example 4: Assessments List Component
export function AssessmentsList() {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAssessments()
  }, [])

  const loadAssessments = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getAssessments({
        limit: 10,
        orderBy: 'created_at',
        ascending: false
      })
      
      if (result.success) {
        setAssessments(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load assessments: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading assessments...</div>
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>

  return (
    <div>
      <h3>My Assessments</h3>
      <button onClick={loadAssessments}>Refresh</button>
      
      {assessments.length === 0 ? (
        <p>No assessments found.</p>
      ) : (
        <ul>
          {assessments.map(assessment => (
            <li key={assessment.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
              <h4>{assessment.title}</h4>
              <p><strong>Status:</strong> {assessment.status}</p>
              <p><strong>Type:</strong> {assessment.assessment_type}</p>
              <p><strong>Score:</strong> {assessment.score || 'N/A'}</p>
              <p><strong>Created:</strong> {new Date(assessment.created_at).toLocaleDateString()}</p>
              {assessment.description && <p>{assessment.description}</p>}
              
              {assessment.assessment_indicators && assessment.assessment_indicators.length > 0 && (
                <div>
                  <strong>Indicators ({assessment.assessment_indicators.length}):</strong>
                  <ul>
                    {assessment.assessment_indicators.map((indicator, index) => (
                      <li key={index}>
                        {indicator.indicator_name}: {indicator.value} (Score: {indicator.score})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Example 5: User Profile Component with Authentication State
export function UserProfile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkCurrentUser()
  }, [])

  const checkCurrentUser = async () => {
    setLoading(true)
    
    try {
      const result = await getCurrentUser()
      
      if (result.success) {
        setUser(result.data.user)
        setProfile(result.data.profile)
      } else {
        console.log('No user logged in')
      }
    } catch (err) {
      console.error('Error checking user:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const result = await logoutUser()
      
      if (result.success) {
        setUser(null)
        setProfile(null)
        window.location.href = '/login'
      }
    } catch (err) {
      console.error('Logout error:', err.message)
    }
  }

  if (loading) return <div>Loading...</div>

  if (!user) {
    return (
      <div>
        <p>Not logged in</p>
        <a href="/login">Login</a>
      </div>
    )
  }

  return (
    <div>
      <h3>User Profile</h3>
      <p><strong>Email:</strong> {user.email}</p>
      {profile && (
        <>
          <p><strong>Name:</strong> {profile.full_name}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Member since:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
        </>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}