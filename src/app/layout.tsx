import React from 'react'
import './globals.css'
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
          {children}
      </body>
    </html>
  )
}