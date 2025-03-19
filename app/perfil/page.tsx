"use client"

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/utils/supabase'
import { toast } from 'react-hot-toast'
import { UserIcon, KeyIcon, BellIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface UserProfile {
  id: string
  nome: string
  email: string
  created_at?: string
  notificacoes_email?: boolean
}

export default function PerfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [nome, setNome] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [notificacoesEmail, setNotificacoesEmail] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('perfil')

  const getUser = async () => {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (session?.user) {
        const { data: userData, error } = await supabaseClient
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (error) throw error
        
        setUser(userData)
        setNome(userData.nome || '')
        setNotificacoesEmail(userData.notificacoes_email || false)
      }
    } catch {
      console.error('Erro ao carregar dados do usuário')
      toast.error('Erro ao carregar dados do usuário')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) throw new Error('Usuário não encontrado')

      const { error } = await supabaseClient
        .from('usuarios')
        .update({ nome })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Perfil atualizado com sucesso!')
      setIsEditing(false)
      getUser()
    } catch {
      toast.error('Erro ao atualizar perfil')
      console.error('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleNotificacoes = async () => {
    try {
      if (!user) return
      
      const { error } = await supabaseClient
        .from('usuarios')
        .update({ notificacoes_email: !notificacoesEmail })
        .eq('id', user.id)

      if (error) throw error

      setNotificacoesEmail(!notificacoesEmail)
      toast.success('Preferências de notificação atualizadas!')
    } catch {
      toast.error('Erro ao atualizar preferências')
      console.error('Erro ao atualizar preferências')
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      toast.success('Senha atualizada com sucesso!')
      setIsChangingPassword(false)
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      toast.error('Erro ao atualizar senha')
      console.error('Erro ao atualizar senha')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#478E89]"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto animate-fadeIn">
      <header className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="font-nunito text-xl sm:text-2xl md:text-4xl font-bold text-[#39555C] mb-1 sm:mb-2">
          Perfil
        </h1>
        <p className="font-inter text-xs sm:text-sm md:text-lg text-[#39555C]/80">
          Configure sua conta e preferências
        </p>
      </header>

      {/* Tabs de Navegação */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#F5EFE0]/30 mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('perfil')}
            className={`flex items-center px-3 sm:px-6 py-4 border-b-2 font-medium text-sm transition-colors flex-1 justify-center ${
              activeTab === 'perfil'
                ? 'border-[#478E89] text-[#478E89]'
                : 'border-transparent text-[#39555C]/70 hover:text-[#39555C]'
            }`}
          >
            <UserIcon className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Informações</span>
          </button>
          <button
            onClick={() => setActiveTab('seguranca')}
            className={`flex items-center px-3 sm:px-6 py-4 border-b-2 font-medium text-sm transition-colors flex-1 justify-center ${
              activeTab === 'seguranca'
                ? 'border-[#478E89] text-[#478E89]'
                : 'border-transparent text-[#39555C]/70 hover:text-[#39555C]'
            }`}
          >
            <KeyIcon className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Segurança</span>
          </button>
          <button
            onClick={() => setActiveTab('notificacoes')}
            className={`flex items-center px-3 sm:px-6 py-4 border-b-2 font-medium text-sm transition-colors flex-1 justify-center ${
              activeTab === 'notificacoes'
                ? 'border-[#478E89] text-[#478E89]'
                : 'border-transparent text-[#39555C]/70 hover:text-[#39555C]'
            }`}
          >
            <BellIcon className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Notificações</span>
          </button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid gap-6">
        {/* Card do Perfil */}
        {activeTab === 'perfil' && (
          <>
            <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#F5EFE0]/30">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 rounded-full bg-[#F5EFE0] flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-[#478E89]" />
                </div>
                <div>
                  <h2 className="font-nunito font-bold text-2xl text-[#39555C]">
                    {user?.nome || 'Usuário'}
                  </h2>
                  <p className="text-sm text-[#39555C]/70">{user?.email}</p>
                  <p className="text-xs text-[#39555C]/50 mt-1">
                    Membro desde {user?.created_at ? format(new Date(user.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : '-'}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#39555C] mb-1">
                    Nome
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-4 py-3 border border-[#F5EFE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#478E89] text-[#39555C]"
                      required
                    />
                  ) : (
                    <div className="flex items-center justify-between bg-[#FAF9F2] px-4 py-3 rounded-lg">
                      <span className="text-[#39555C]">{user?.nome || 'Não definido'}</span>
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-[#478E89] hover:underline font-medium"
                      >
                        Editar
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#39555C] mb-1">
                    Email
                  </label>
                  <div className="bg-[#FAF9F2] px-4 py-3 rounded-lg text-[#39555C]">
                    {user?.email}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setNome(user?.nome || '')
                      }}
                      className="px-4 py-2 text-sm font-medium text-[#39555C] hover:bg-[#F5EFE0]/50 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="rounded-lg bg-gradient-to-r from-[#478E89] to-[#2F6874] px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Aba de Segurança */}
        {activeTab === 'seguranca' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#F5EFE0]/30">
            <div className="flex items-center gap-3 mb-6">
              <KeyIcon className="w-6 h-6 text-[#478E89]" />
              <h2 className="font-nunito font-bold text-xl text-[#39555C]">Segurança</h2>
            </div>

            {!isChangingPassword ? (
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-nunito font-bold text-lg text-[#39555C] mb-1">Senha</h3>
                  <p className="text-sm text-[#39555C]/70">
                    Altere sua senha periodicamente para maior segurança
                  </p>
                </div>
                <button 
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 text-sm font-medium text-[#478E89] hover:bg-[#F5EFE0]/50 rounded-lg transition-colors"
                >
                  Alterar Senha
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#39555C] mb-1">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-[#F5EFE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#478E89] text-[#39555C]"
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#39555C] mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-[#F5EFE0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#478E89] text-[#39555C]"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false)
                      setNewPassword('')
                      setConfirmPassword('')
                    }}
                    className="px-4 py-2 text-sm font-medium text-[#39555C] hover:bg-[#F5EFE0]/50 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-gradient-to-r from-[#478E89] to-[#2F6874] px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Aba de Notificações */}
        {activeTab === 'notificacoes' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border border-[#F5EFE0]/30">
            <div className="flex items-center gap-3 mb-6">
              <BellIcon className="w-6 h-6 text-[#478E89]" />
              <h2 className="font-nunito font-bold text-xl text-[#39555C]">Notificações</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start justify-between pb-6 border-b border-[#F5EFE0]">
                <div>
                  <h3 className="font-nunito font-bold text-lg text-[#39555C] mb-1">
                    Notificações por Email
                  </h3>
                  <p className="text-sm text-[#39555C]/70">
                    Receba lembretes e atualizações importantes
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificacoesEmail}
                    onChange={handleToggleNotificacoes}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#F5EFE0] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#478E89]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#F5EFE0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#478E89]"></div>
                </label>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-nunito font-bold text-lg text-[#39555C] mb-1">
                    Lembretes de Meditação
                  </h3>
                  <p className="text-sm text-[#39555C]/70">
                    Receba lembretes diários para suas práticas
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#F5EFE0] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#478E89]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#F5EFE0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#478E89]"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 