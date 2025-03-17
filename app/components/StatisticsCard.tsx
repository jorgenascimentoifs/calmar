import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
} from 'chart.js'

// Registrar componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
)

interface StatisticsCardProps {
  title: string
  value: string | number
  change: number
  data?: number[]
  color: string
}

export default function StatisticsCard({ 
  title, 
  value, 
  change, 
  data = [], // Valor padrão caso não seja fornecido
  color 
}: StatisticsCardProps) {
  // Verificar se temos dados válidos para o gráfico
  const hasValidData = Array.isArray(data) && data.length > 0

  const chartData = {
    labels: hasValidData ? Array(data.length).fill('') : [],
    datasets: [
      {
        data: hasValidData ? data : [0],
        fill: true,
        borderColor: color,
        backgroundColor: `${color}10`,
        tension: 0.4,
        borderWidth: 1.5,
        pointRadius: 0,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false
        }
      },
      y: {
        display: false,
        grid: {
          display: false
        },
        min: hasValidData ? Math.min(...data) * 0.8 : 0,
        max: hasValidData ? Math.max(...data) * 1.2 : 1,
      },
    },
  }

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 md:p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-[#F5EFE0]/30">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-medium text-[#39555C]/70">{title}</h3>
          <div className={`flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs ${
            change >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {change >= 0 ? (
              <ArrowUpIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            ) : (
              <ArrowDownIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            )}
            <span className="font-medium">{Math.abs(change)}%</span>
          </div>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl font-bold text-[#39555C] font-nunito tracking-tight">
          {value}
        </p>
      </div>
      
      <div className="h-[45px] sm:h-[50px] md:h-16 mt-2 sm:mt-3">
        {hasValidData ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#39555C]/40 text-xs sm:text-sm">
            Sem dados disponíveis
          </div>
        )}
      </div>
    </div>
  )
} 