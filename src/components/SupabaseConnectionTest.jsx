import React, { useEffect, useState } from 'react'
import { supabase, testSupabaseConnection } from '../lib/supabase-config'
import EnvDebug from './EnvDebug'

/**
 * Supabase Connection Test Component
 * Tests the Supabase connection and displays debug information
 */
export function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setLoading(true)
    console.log('🧪 Testing Supabase connection...')
    
    try {
      const result = await testSupabaseConnection()
      setConnectionStatus(result)
      console.log('Connection test result:', result)
    } catch (error) {
      console.error('Connection test failed:', error)
      setConnectionStatus({
        success: false,
        error: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🔗 Supabase Connection Test</h2>
      
      <div style={{ 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        backgroundColor: connectionStatus?.success ? '#d4edda' : 
                        connectionStatus?.success === false ? '#f8d7da' : '#fff3cd',
        border: `1px solid ${connectionStatus?.success ? '#c3e6cb' : 
                              connectionStatus?.success === false ? '#f5c6cb' : '#ffeaa7'}`
      }}>
        {loading ? (
          <div>🔄 Testing connection...</div>
        ) : connectionStatus?.success ? (
          <div>
            <div>✅ <strong>Connection Successful!</strong></div>
            <div>Your Supabase configuration is working correctly.</div>
          </div>
        ) : (
          <div>
            <div>❌ <strong>Connection Failed</strong></div>
            <div>Error: {connectionStatus?.error}</div>
            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={() => setShowDebug(!showDebug)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {showDebug ? 'Hide' : 'Show'} Debug Info
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testConnection}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Connection Again'}
        </button>
      </div>

      <div style={{ 
        padding: '15px', 
        backgroundColor: '#e9ecef', 
        borderRadius: '8px',
        marginBottom: '20px' 
      }}>
        <h3>📋 Quick Status</h3>
        <ul>
          <li><strong>Supabase Client:</strong> {supabase ? '✅ Initialized' : '❌ Failed to initialize'}</li>
          <li><strong>Connection Test:</strong> {
            loading ? '⏳ Testing...' : 
            connectionStatus?.success ? '✅ Passed' : '❌ Failed'
          }</li>
          <li><strong>Environment:</strong> {import.meta.env.MODE}</li>
        </ul>
      </div>

      {(showDebug || !connectionStatus?.success) && <EnvDebug />}

      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h4>🛠️ Troubleshooting Steps:</h4>
        <ol>
          <li>Check that your <code>.env.local</code> file exists in the root directory</li>
          <li>Verify that VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set</li>
          <li>Restart your development server after changing environment variables</li>
          <li>Deploy the database schema to your Supabase project</li>
          <li>Check browser console for detailed error messages</li>
        </ol>
      </div>
    </div>
  )
}

export default SupabaseConnectionTest