"use client"

import { useState } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

type Activity = {
  id: string
  title: string
  time: string
  duration: number // em minutos
  type: 'meditation' | 'therapy' | 'exercise'
}

const ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Meditação Guiada',
    time: '09:00',
    duration: 30,
    type: 'meditation'
  },
  {
    id: '2',
    title: 'Sessão de Terapia',
    time: '14:00',
    duration: 60,
    type: 'therapy'
  },
  {
    id: '3',
    title: 'Exercício de Respiração',
    time: '16:30',
    duration: 15,
    type: 'exercise'
  }
]

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'meditation':
      return '🧘‍♀️'
    case 'therapy':
      return '💬'
    case 'exercise':
      return '🌬️'
  }
}

export default function DailySchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [draggingActivity, setDraggingActivity] = useState<string | null>(null)

  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1))
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1))

  const handleDragStart = (activityId: string) => {
    setDraggingActivity(activityId)
  }

  const handleDragEnd = () => {
    setDraggingActivity(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button
          onClick={handlePrevDay}
          className="p-2 hover:bg-[#F5EFE0]/50 rounded-lg transition-colors"
        >
          <ChevronLeftIcon className="w-5 h-5 text-[#39555C]" />
        </button>

        <h2 className="font-nunito font-bold text-lg text-[#39555C]">
          {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </h2>

        <button
          onClick={handleNextDay}
          className="p-2 hover:bg-[#F5EFE0]/50 rounded-lg transition-colors"
        >
          <ChevronRightIcon className="w-5 h-5 text-[#39555C]" />
        </button>
      </div>

      {/* Timeline */}
      <div className="p-4">
        <div className="space-y-3">
          {ACTIVITIES.map(activity => (
            <div
              key={activity.id}
              draggable
              onDragStart={() => handleDragStart(activity.id)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-3 p-3 rounded-xl bg-[#F5EFE0]/30 cursor-move hover:shadow-md transition-all ${
                draggingActivity === activity.id ? 'opacity-50' : ''
              }`}
            >
              <span className="text-xl">{getActivityIcon(activity.type)}</span>
              <div className="flex-1">
                <h4 className="font-inter font-medium text-[#39555C]">
                  {activity.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-[#39555C]/70">{activity.time}</span>
                  <span className="text-sm text-[#39555C]/60">•</span>
                  <span className="text-sm text-[#39555C]/70">
                    {activity.duration} min
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white">
                <span className="text-xs font-medium text-[#2F6874]">
                  {activity.time.split(':')[0]}h
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 