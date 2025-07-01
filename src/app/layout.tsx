// app/login/layout.tsx
import React from 'react'
import { QueryProvider } from '@/components/QueryProvider' 
import SideBar from '@/components/SideBar' 
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
        <QueryProvider>
          <div className="flex">
            <SideBar />
            <div className="flex-1">{children}</div>
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}
