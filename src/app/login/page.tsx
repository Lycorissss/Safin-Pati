// src/app/login/page.tsx
'use client'

import { useLogin } from '@/hooks/useLogin'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Login Test</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ padding: '8px' }}
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ padding: '8px' }}
        />
        
        <button 
          type="submit" 
          disabled={loginMutation.isPending}
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
        >
          {loginMutation.isPending ? 'Loading...' : 'Login'}
        </button>
      </form>

      {loginMutation.isError && (
        <p style={{ color: 'red' }}>Error: {loginMutation.error?.message}</p>
      )}

      {loginMutation.isSuccess && (
        <p style={{ color: 'green' }}>Login successful!</p>
      )}
    </div>
  )
}