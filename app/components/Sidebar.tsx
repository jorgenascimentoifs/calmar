"use client"

import Link from 'next/link'
import Image from 'next/image'
import { HomeIcon, BookOpenIcon, CalendarIcon, UserIcon, Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import ConfirmationModal from './ConfirmationModal'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type LogoutError = {
  message: string;
  details?: Record<string, unknown>; // Replace [key: string]: any with a more specific type
}

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Mostrar toast e aguardar antes de redirecionar
      toast.success('Logout realizado com sucesso!')
      
      // Aguardar 1.5 segundos antes de redirecionar
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1500)
    } catch (error: unknown) {
      const logoutError = error as LogoutError;
      toast.error('Erro ao fazer logout: ' + logoutError.message);
    }
  }

  return (
    <>
      <ConfirmationModal
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={handleLogout}
        title="Confirmar Logout"
        message="Tem certeza que deseja sair da sua conta?"
      />

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-40 md:hidden flex items-center justify-between px-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg bg-gradient-to-r from-[#478E89] to-[#2F6874] shadow-md hover:opacity-90 transition-opacity"
        >
          <Bars3Icon className="w-6 h-6 text-white" />
        </button>
        
        <Image
          src="/logo.png"
          alt="Calmar Logo"
          width={100}
          height={32}
          className="object-contain"
        />
        
        <div className="w-10 opacity-0" />
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 bg-white/95 backdrop-blur-sm shadow-xl h-screen fixed left-0 top-0 border-r border-[#F5EFE0]">
        <div className="p-6 h-full flex flex-col">
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo.png"
              alt="Calmar Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
          
          <nav className="space-y-2 flex-1">
            <NavItem href="/dashboard" icon={<HomeIcon />} text="Início" active />
            <NavItem href="/dashboard/diario" icon={<BookOpenIcon />} text="Diário" />
            <NavItem href="/dashboard/sessoes" icon={<CalendarIcon />} text="Sessões" />
            <NavItem href="/dashboard/perfil" icon={<UserIcon />} text="Perfil" />
            <NavItem 
              href="#"
              icon={<ArrowRightOnRectangleIcon />}
              text="Sair"
              onClick={(e) => {
                e.preventDefault()
                setShowLogoutConfirmation(true)
              }}
              className="mt-4 !bg-red-50 !text-red-600 hover:!bg-red-100"
            />
          </nav>
        </div>
      </aside>

      {/* Mobile Menu - Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-64 bg-white h-full p-6 relative animate-slideIn"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F5EFE0]/50 transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-[#39555C]" />
            </button>
            <div className="mb-8 flex justify-center">
              <Image
                src="/logo.png"
                alt="Calmar Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </div>
            
            <nav className="space-y-2">
              <NavItem href="/dashboard" icon={<HomeIcon />} text="Início" active />
              <NavItem href="/dashboard/diario" icon={<BookOpenIcon />} text="Diário" />
              <NavItem href="/dashboard/sessoes" icon={<CalendarIcon />} text="Sessões" />
              <NavItem href="/dashboard/perfil" icon={<UserIcon />} text="Perfil" />
              <NavItem 
              href="#"
              icon={<ArrowRightOnRectangleIcon />}
              text="Sair"
              onClick={(e) => {
                e.preventDefault()
                setShowLogoutConfirmation(true)
              }}
              className="mt-4 !bg-red-50 !text-red-600 hover:!bg-red-100"
            />
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

function NavItem({ 
  href, 
  icon, 
  text, 
  active = false,
  onClick,
  className = ''
}: {
  href: string
  icon: React.ReactNode
  text: string
  active?: boolean
  onClick?: (e: React.MouseEvent) => void
  className?: string
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02] ${
        active
          ? 'bg-gradient-to-r from-[#478E89] to-[#2F6874] text-white shadow-md'
          : 'text-[#39555C] hover:bg-[#F5EFE0]/50'
      } ${className}`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="font-inter font-medium">{text}</span>
    </Link>
  )
} 