// src/hooks/useLogin.ts
'use client'

import { useMutation } from '@tanstack/react-query'

interface LoginInput {
  email: string
  password: string
}

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginInput) => {
      console.log('Login attempt:', data)
      
      const response = await fetch('/auth/login', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Login gagal')
      }

      return response.json()
    },
    onSuccess: (data) => {
      console.log('Login success:', data)
    },
    onError: (err) => {
      console.error('Login error:', err)
    },
  })
}