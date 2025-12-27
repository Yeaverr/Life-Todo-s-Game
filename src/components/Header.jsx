import { useStore } from '../store/useStore'
import { Trophy, Coins, Zap } from 'lucide-react'

export default function Header() {
  const { level, xp, coins, dailyStreak } = useStore()
  
  // Calculate XP needed for next level
  const getXPForLevel = (level) => {
    return Math.floor(100 * Math.pow(1.5, level - 1))
  }
  const xpNeeded = getXPForLevel(level + 1)
  const xpProgress = (xp / xpNeeded) * 100

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white">
              🎮 Life ToDos Game
            </h1>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Level */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold">Level {level}</span>
            </div>

            {/* XP Progress */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 min-w-[200px]">
              <div className="flex justify-between text-xs text-white mb-1">
                <span>XP: {xp}</span>
                <span>{xpNeeded} for next level</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(xpProgress, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Coins */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-semibold">{coins} 🪙</span>
            </div>

            {/* Streak */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold">
                {dailyStreak} day streak 🔥
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

