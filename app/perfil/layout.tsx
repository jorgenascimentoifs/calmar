import { Nunito, Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import Sidebar from '@/app/components/Sidebar'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-nunito',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
})

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${nunito.variable} ${inter.variable} min-h-screen bg-[#FAF9F2]`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#39555C',
            border: '1px solid #F5EFE0',
            padding: '16px',
            borderRadius: '12px',
          },
          success: {
            duration: 4000,
            style: {
              background: '#EDF7F6',
              border: '1px solid #478E89',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#FEF2F2',
              border: '1px solid #EF4444',
            },
          },
        }}
      />
      <Sidebar />
      <main className="min-h-screen md:ml-64 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
} 