"use client"

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { supabaseClient } from '@/utils/supabase'
import toast from 'react-hot-toast'

type AuthError = {
  message: string;
  details?: Record<string, unknown>; // Replace [key: string]: any with a more specific type
}

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        toast.success('Login realizado com sucesso!')
        
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      } else {
        const { data: inviteData, error: inviteError } = await supabaseClient
          .from('convites')
          .select('*')
          .eq('codigo', inviteCode)
          .eq('utilizado', false)
          .single()
        
        if (inviteError || !inviteData) {
          throw new Error('Código de convite inválido ou já utilizado')
        }
        
        const { data: authData, error: signUpError } = await supabaseClient.auth.signUp({
          email,
          password,
        })
        
        if (signUpError) throw signUpError
        
        if (authData?.user) {
          const { error: updateUserError } = await supabaseClient
            .from('usuarios')
            .update({ nome })
            .eq('id', authData.user.id)
          
          if (updateUserError) {
            console.error('Erro ao atualizar nome do usuário:', updateUserError)
          }
          
          const { error: updateError } = await supabaseClient
            .from('convites')
            .update({
              utilizado: true,
              utilizado_por: authData.user.id,
              data_utilizacao: new Date().toISOString()
            })
            .eq('id', inviteData.id)
          
          if (updateError) {
            console.error('Erro ao atualizar código de convite:', updateError)
          }
        }
        
        toast.success('Cadastro realizado com sucesso!')
        
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      }
    } catch (error: unknown) {
      const authError = error as AuthError;
      let errorMessage = 'Ocorreu um erro. Tente novamente.'
      
      if (authError.message.includes('Email not confirmed')) {
        errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.'
      } else if (authError.message.includes('Invalid login credentials')) {
        errorMessage = 'Credenciais inválidas. Verifique seu email e senha.'
      } else if (authError.message.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado.'
      } else if (authError.message.includes('Código de convite')) {
        errorMessage = authError.message
      } else if (authError.message.includes('Password should be')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.'
      }
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = async () => {
    const { data: { session } } = await supabaseClient.auth.getSession()
    if (session) {
      onClose()
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={handleClose}>
        <div className="fixed inset-0 bg-[#4A4A4A]/30 backdrop-blur-sm" />
        <div className="fixed inset-0 flex justify-center items-center">
          <Dialog.Panel className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg w-[calc(100%-2rem)] sm:w-full max-w-md mx-4 sm:mx-0">
            <Dialog.Title className="text-lg font-semibold text-[#2F6874] mb-4">
              {isLogin ? 'Fazer Login' : 'Criar Conta'}
            </Dialog.Title>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#39555C] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#F5EFE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#478E89] text-[#39555C]"
                  required
                  placeholder="Digite seu email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#39555C] mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-[#F5EFE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#478E89] text-[#39555C]"
                  required
                  placeholder="Digite sua senha"
                />
              </div>
              
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#39555C] mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-3 py-2 border border-[#F5EFE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#478E89] text-[#39555C]"
                      required
                      placeholder="Digite seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#39555C] mb-1">
                      Código de Convite
                    </label>
                    <input
                      type="text"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="w-full px-3 py-2 border border-[#F5EFE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#478E89] text-[#39555C]"
                      required
                      placeholder="Digite o código de 4 dígitos"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-[#478E89] to-[#2F6874] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-[#2F6874] hover:underline"
              >
                {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
} 