// Example React Components using the Supabase Backend API
// These examples show how to integrate the backend with your frontend

import React, { useState, useEffect } from 'react'
import { useAuth, useAssessment, AuthProvider } from '../lib/supabase-client'
import type { RegisterRequest, CreateAssessmentRequest } from '../../api/types/database'

// 1. Login Component Example
export const LoginExample: React.FC = () => {
  const { signIn, loading, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await signIn(email, password)
      // User will be automatically updated via auth context
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (user) {
    return <div>Welcome, {user.email}!</div>
  }

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

// 2. Registration Component Example
export const RegisterExample: React.FC = () => {
  const { signUp, loading } = useAuth()
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    address: '',
    role: 'petani'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await signUp(formData)
      setSuccess(response.message || 'Registration successful!')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Address
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="petani">Petani</option>
          <option value="manajer">Manajer</option>
        </select>
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
          minLength={6}
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}

// 3. Assessment Management Example
export const AssessmentExample: React.FC = () => {
  const { user, profile } = useAuth()
  const { assessments, loading, error, createAssessment, getAssessments } = useAssessment()
  const [newAssessment, setNewAssessment] = useState<CreateAssessmentRequest>({
    stage: 'pretest',
    answers_json: {},
    total_score: 0,
    max_score: 100,
    percentage: 0
  })

  useEffect(() => {
    if (user) {
      getAssessments()
    }
  }, [user, getAssessments])

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Example assessment data
      const assessmentData: CreateAssessmentRequest = {
        stage: newAssessment.stage,
        answers_json: {
          'question1': { answer: 'Yes', score: 10, max_score: 10 },
          'question2': { answer: 'No', score: 0, max_score: 10 },
          'question3': { answer: 'Maybe', score: 5, max_score: 10 }
        },
        total_score: 15,
        max_score: 30,
        percentage: 50
      }
      
      await createAssessment(assessmentData)
      alert('Assessment saved successfully!')
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  if (!user) {
    return <div>Please login to view assessments</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Assessment Management</h2>
      
      {profile && (
        <div className="bg-blue-100 p-4 rounded mb-4">
          <p>Welcome, {profile.full_name} ({profile.role})</p>
        </div>
      )}
      
      {/* Create New Assessment */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Create New Assessment</h3>
        <form onSubmit={handleCreateAssessment} className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Stage</label>
            <select
              value={newAssessment.stage}
              onChange={(e) => setNewAssessment({ ...newAssessment, stage: e.target.value as any })}
              className="border rounded px-3 py-2"
            >
              <option value="pretest">Pre-test</option>
              <option value="stage1">Stage 1</option>
              <option value="stage2">Stage 2</option>
              <option value="stage3">Stage 3</option>
              <option value="final">Final</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Assessment'}
          </button>
        </form>
      </div>
      
      {/* Display Assessments */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Your Assessments</h3>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <p>Loading assessments...</p>
        ) : (
          <div className="grid gap-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="border rounded p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{assessment.stage.toUpperCase()}</h4>
                    <p className="text-gray-600">Score: {assessment.total_score}/{assessment.max_score} ({assessment.percentage}%)</p>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(assessment.created_at).toLocaleDateString()}
                    </p>
                    {assessment.completed_at && (
                      <p className="text-sm text-green-600">
                        Completed: {new Date(assessment.completed_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-sm ${
                      assessment.completed_at 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {assessment.completed_at ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {assessments.length === 0 && (
              <p className="text-gray-500 italic">No assessments found. Create your first assessment above!</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// 4. User Profile Example
export const ProfileExample: React.FC = () => {
  const { user, profile, updateProfile, loading } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    role: 'petani' as const
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
        role: profile.role
      })
    }
  }, [profile])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await updateProfile(formData)
      setEditing(false)
      alert('Profile updated successfully!')
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    }
  }

  if (!user || !profile) {
    return <div>Please login to view profile</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      
      {!editing ? (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{profile.full_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{profile.phone}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">{profile.address}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900">{profile.role}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Member Since</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setEditing(true)}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="bg-white shadow rounded-lg p-6">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="petani">Petani</option>
                <option value="manajer">Manajer</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

// 5. Main App Example with Auth Provider
export const AppExample: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">SAT RSPO PADI</h1>
          
          <div className="space-y-8">
            <LoginExample />
            <hr className="my-8" />
            <RegisterExample />
            <hr className="my-8" />
            <ProfileExample />
            <hr className="my-8" />
            <AssessmentExample />
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}