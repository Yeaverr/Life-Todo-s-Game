import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Trophy, Coins, Clock } from 'lucide-react'

export default function Header() {
  const { dailyLevel, weeklyLevel, coins } = useStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Real Life Todo's Game
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-center w-full md:w-auto">
            {/* Daily Level */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 h-[45px] sm:h-[50px] min-w-[100px] sm:min-w-[120px] justify-center border-2 border-gray-700">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
              <span className="text-white font-bold text-xs sm:text-sm">Daily Lv.{dailyLevel}</span>
            </div>

            {/* Weekly Level */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 h-[45px] sm:h-[50px] min-w-[100px] sm:min-w-[120px] justify-center border-2 border-gray-700">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
              <span className="text-white font-bold text-xs sm:text-sm">Weekly Lv.{weeklyLevel}</span>
            </div>

            {/* Coins */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 h-[45px] sm:h-[50px] min-w-[100px] sm:min-w-[120px] justify-center border-2 border-gray-700">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
              <span className="text-orange-400 font-bold text-xs sm:text-sm">{coins} 🪙</span>
            </div>

            {/* Current Time */}
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 h-[45px] sm:h-[50px] min-w-[120px] sm:min-w-[140px] justify-center border-2 border-gray-700">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300" />
              <span className="text-white font-bold text-xs sm:text-sm">{formatTime(currentTime)}</span>
            </div>

          </div>
        </div>
      </div>
    </header>
  )
}

