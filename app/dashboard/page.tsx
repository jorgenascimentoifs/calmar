"use client"

import { useEffect, useRef, useState } from 'react'
import DailySchedule from '@/app/components/DailySchedule'
import { supabaseClient } from '@/utils/supabase'
import AuthModal from '@/app/components/AuthModal'
import { toast } from 'react-hot-toast'
import StatisticsCard from '@/app/components/StatisticsCard'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

// Função para desenhar gráfico de linha
const drawLineChart = (
  canvas: HTMLCanvasElement, 
  data: number[], 
  color: string, 
  fillColor: string
) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const width = rect.width
  const height = rect.height
  const padding = 10
  const dataMax = Math.max(...data)
  const dataLength = data.length

  ctx.clearRect(0, 0, width, height)
  
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = 2

  data.forEach((value, index) => {
    const x = padding + (index / (dataLength - 1)) * (width - padding * 2)
    const y = height - padding - (value / dataMax) * (height - padding * 2)
    
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })

  ctx.stroke()

  ctx.lineTo(width - padding, height - padding)
  ctx.lineTo(padding, height - padding)
  ctx.closePath()
  ctx.fillStyle = fillColor
  ctx.fill()
}

// Função para desenhar gráfico de rosca
const drawDoughnutChart = (
  canvas: HTMLCanvasElement,
  percentage: number,
  color: string
) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  const width = rect.width
  const height = rect.height
  const centerX = width / 2
  const centerY = height / 2
  const radius = Math.min(centerX, centerY) - 8

  ctx.clearRect(0, 0, width, height)

  // Fundo
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.strokeStyle = '#E5E7EB'
  ctx.lineWidth = 6
  ctx.stroke()

  // Progresso
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, -Math.PI / 2, (-Math.PI / 2) + (percentage / 100) * (2 * Math.PI))
  ctx.strokeStyle = color
  ctx.lineWidth = 6
  ctx.stroke()

  // Texto central
  ctx.fillStyle = color
  ctx.font = '14px Inter'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${percentage}%`, centerX, centerY)
}

// Corrigir a interface UserData
interface UserData {
  id: string;
  nome: string;
  email: string;
  // Remover o índice de tipo que estava causando conflito
  // e adicionar propriedades opcionais que podem existir
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, unknown>;
}

export default function DashboardPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const moodChartRef = useRef<HTMLCanvasElement>(null)
  const sessionsChartRef = useRef<HTMLCanvasElement>(null)
  const streakChartRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession()
      
      if (session?.user) {
        const { data: userData, error: userError } = await supabaseClient
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (userError) throw userError
        
        setUserData(userData)
      } else {
        setIsAuthModalOpen(true)
      }
    } catch {
      console.error('Erro ao verificar autenticação')
      toast.error('Erro ao verificar autenticação')
      setIsAuthModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const renderCharts = () => {
      if (moodChartRef.current) {
        moodChartRef.current.width = moodChartRef.current.offsetWidth * 2
        moodChartRef.current.height = moodChartRef.current.offsetHeight * 2
        drawLineChart(
          moodChartRef.current,
          [3, 4, 3, 5, 7, 6, 8],
          '#478E89',
          'rgba(71, 142, 137, 0.2)'
        )
      }

      if (sessionsChartRef.current) {
        sessionsChartRef.current.width = sessionsChartRef.current.offsetWidth * 2
        sessionsChartRef.current.height = sessionsChartRef.current.offsetHeight * 2
        drawDoughnutChart(
          sessionsChartRef.current,
          75,
          '#478E89'
        )
      }

      if (streakChartRef.current) {
        streakChartRef.current.width = streakChartRef.current.offsetWidth * 2
        streakChartRef.current.height = streakChartRef.current.offsetHeight * 2
        drawLineChart(
          streakChartRef.current,
          [2, 4, 6, 8, 10, 12, 15],
          '#2F6874',
          'rgba(47, 104, 116, 0.2)'
        )
      }
    }

    renderCharts()

    // Adicionar listener para redimensionamento
    window.addEventListener('resize', renderCharts)
    return () => window.removeEventListener('resize', renderCharts)
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#478E89]"></div>
    </div>
  }

  const statisticsData = [
    {
      title: "Sessões Realizadas",
      value: "24",
      change: 12,
      data: [4, 6, 5, 8, 7, 9, 8],
      color: "#478E89"
    },
    {
      title: "Tempo Meditado",
      value: "3.5h",
      change: -5,
      data: [2, 3, 2.5, 3, 3.2, 2.8, 2.5],
      color: "#2F6874"
    },
    {
      title: "Nível de Ansiedade",
      value: "Baixo",
      change: -25,
      data: [7, 6, 5, 4, 3, 4, 3],
      color: "#A0CEC9"
    },
    {
      title: "Humor Geral",
      value: "Bom",
      change: 15,
      data: [6, 7, 6.5, 7.5, 8, 7.8, 8],
      color: "#39555C"
    }
  ]

  return (
    <>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      <div className="max-w-7xl mx-auto animate-fadeIn">
        {/* Cabeçalho */}
        <header className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="font-nunito text-xl sm:text-2xl md:text-4xl font-bold text-[#39555C] mb-1 sm:mb-2">
            {userData?.nome 
              ? `Olá, ${userData.nome.split(' ')[0]}! 👋` 
              : 'Olá! 👋'}
          </h1>
          <p className="font-inter text-xs sm:text-sm md:text-lg text-[#39555C]/80">
            Acompanhe seu progresso
          </p>
        </header>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
          {statisticsData.map((stat, index) => (
            <StatisticsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              data={stat.data}
              color={stat.color}
            />
          ))}
        </div>

        {/* Calendário de Atividades */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <DailySchedule />
        </div>
      </div>
    </>
  )
} 