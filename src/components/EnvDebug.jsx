import React from 'react'

/**
 * Environment Debug Component
 * This component displays all available environment variables to help debug Supabase configuration
 */
export function EnvDebug() {
  const envVars = {
    // Vite environment variables
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    
    // All Vite env vars
    allViteEnv: import.meta.env,
    
    // Environment info
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    mode: import.meta.env.MODE
  }

  console.log('🔍 Environment Debug Info:', envVars)

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '8px', 
      margin: '20px',
      fontFamily: 'monospace'
    }}>
      <h3>🔍 Environment Variables Debug</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <h4>Supabase Configuration:</h4>
        <p><strong>VITE_SUPABASE_URL:</strong> {envVars.VITE_SUPABASE_URL || '❌ Missing'}</p>
        <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {envVars.VITE_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing'}</p>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4>Environment Info:</h4>
        <p><strong>Mode:</strong> {envVars.mode}</p>
        <p><strong>Dev:</strong> {envVars.isDev ? 'Yes' : 'No'}</p>
        <p><strong>Prod:</strong> {envVars.isProd ? 'Yes' : 'No'}</p>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4>All Vite Environment Variables:</h4>
        <pre style={{ 
          backgroundColor: '#333', 
          color: '#fff', 
          padding: '10px', 
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify(envVars.allViteEnv, null, 2)}
        </pre>
      </div>

      <div style={{ 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        padding: '10px', 
        borderRadius: '4px' 
      }}>
        <h4>💡 Troubleshooting Tips:</h4>
        <ul>
          <li>Make sure your <code>.env.local</code> file is in the root directory</li>
          <li>Environment variables must start with <code>VITE_</code> to be accessible in the browser</li>
          <li>Restart your dev server after adding new environment variables</li>
          <li>Check that your <code>.env.local</code> file is not in <code>.gitignore</code> during development</li>
        </ul>
      </div>
    </div>
  )
}

export default EnvDebug