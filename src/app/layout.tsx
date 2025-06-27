// app/login/layout.tsx
import React from 'react'
import { QueryProvider } from '@/components/QueryProvider' // atau path lain yg benar

export const metadata = {
  title: 'Login',
  description: 'Halaman login user',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
