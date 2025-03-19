import { Nunito, Inter } from 'next/font/google'
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
      <Sidebar />
      <main className="min-h-screen md:ml-64 transition-all duration-300">
        <div className="container mx-auto p-4 md:p-8 pt-20 md:pt-8">
          <div className="max-w-full overflow-x-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
} 