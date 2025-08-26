import React, { useState } from 'react'
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../lib/auth.js'
import { insertAssessment, getAssessments } from '../lib/data.js'

/**
 * Test Component for Supabase Integration
 * Add this component to your app to test Supabase functions
 */
export function TestSupabase() {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState({})

  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }))
    
    try {
      const result = await testFunction()
      setResults(prev => ({ ...prev, [testName]: result }))
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: error.message 
        } 
      }))
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }))
    }
  }

  const tests = [
    {
      name: 'connection',
      label: 'Test Connection',
      action: async () => {
        const { testConnection } = await import('../lib/supabaseClient.js')
        return await testConnection()
      }
    },
    {
      name: 'register',
      label: 'Register User',
      action: () => registerUser(
        'test@example.com',
        'password123',
        'Test User',
        'petani'
      )
    },
    {
      name: 'login',
      label: 'Login User',
      action: () => loginUser('test@example.com', 'password123')
    },
    {
      name: 'currentUser',
      label: 'Get Current User',
      action: () => getCurrentUser()
    },
    {
      name: 'insertAssessment',
      label: 'Insert Assessment',
      action: () => insertAssessment({
        title: 'Test Assessment',
        description: 'Frontend test assessment',
        status: 'draft',
        assessment_type: 'sustainability',
        score: 90
      })
    },
    {
      name: 'getAssessments',
      label: 'Get Assessments',
      action: () => getAssessments({ limit: 5 })
    },
    {
      name: 'logout',
      label: 'Logout User',
      action: () => logoutUser()
    }
  ]

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🧪 Supabase Integration Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Instructions:</strong></p>
        <ol>
          <li>First, ensure database schema is deployed to Supabase</li>
          <li>Test connection first</li>
          <li>Run tests in order: Register → Login → Current User → etc.</li>
          <li>Check browser console for detailed logs</li>
        </ol>
      </div>

      <div style={{ display: 'grid', gap: '10px' }}>
        {tests.map(test => (
          <div key={test.name} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            borderRadius: '5px',
            backgroundColor: results[test.name]?.success === false ? '#ffe6e6' : 
                           results[test.name]?.success === true ? '#e6ffe6' : '#f9f9f9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0 }}>{test.label}</h4>
              <button 
                onClick={() => runTest(test.name, test.action)}
                disabled={loading[test.name]}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {loading[test.name] ? 'Testing...' : 'Run Test'}
              </button>
            </div>
            
            {results[test.name] && (
              <div style={{ marginTop: '10px' }}>
                <strong>Result:</strong>
                <pre style={{ 
                  backgroundColor: '#f0f0f0', 
                  padding: '10px', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px'
                }}>
                  {JSON.stringify(results[test.name], null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>🔍 Environment Check</h4>
        <ul>
          <li><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL || '❌ Not found'}</li>
          <li><strong>Supabase Key:</strong> {(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY) ? '✅ Found' : '❌ Not found'}</li>
        </ul>
      </div>
    </div>
  )
}

export default TestSupabase