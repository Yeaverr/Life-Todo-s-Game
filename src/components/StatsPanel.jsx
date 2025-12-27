import { useStore } from '../store/useStore'
import { Trophy, Coins, Target, TrendingUp, Award } from 'lucide-react'

export default function StatsPanel() {
  const {
    level,
    totalXP,
    coins,
    totalEarned,
    dailyStreak,
    quests,
  } = useStore()

  // Calculate statistics
  const totalQuests = Object.values(quests).flat().length
  const completedQuests = Object.values(quests)
    .flat()
    .filter((q) => q.completed).length
  const completionRate =
    totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0

  const questsByType = {
    daily: quests.daily.filter((q) => q.completed).length,
    weekly: quests.weekly.filter((q) => q.completed).length,
    monthly: quests.monthly.filter((q) => q.completed).length,
    yearly: quests.yearly.filter((q) => q.completed).length,
  }

  const stats = [
    {
      icon: Trophy,
      label: 'Current Level',
      value: level,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/20',
    },
    {
      icon: TrendingUp,
      label: 'Total XP',
      value: totalXP.toLocaleString(),
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/20',
    },
    {
      icon: Coins,
      label: 'Total Earned',
      value: `${totalEarned.toLocaleString()} 🪙`,
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
    },
    {
      icon: Target,
      label: 'Completion Rate',
      value: `${completionRate}%`,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20',
    },
    {
      icon: Award,
      label: 'Daily Streak',
      value: `${dailyStreak} days 🔥`,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20',
    },
    {
      icon: Target,
      label: 'Completed Quests',
      value: `${completedQuests}/${totalQuests}`,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/20',
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Your Statistics</h2>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg`}
          >
            <div className="flex items-center gap-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <p className="text-white/70 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} text-white`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quest Completion by Type */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">
          Quests Completed by Type
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">
              {questsByType.daily}
            </div>
            <div className="text-white/70 text-sm">Daily</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">
              {questsByType.weekly}
            </div>
            <div className="text-white/70 text-sm">Weekly</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">
              {questsByType.monthly}
            </div>
            <div className="text-white/70 text-sm">Monthly</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">
              {questsByType.yearly}
            </div>
            <div className="text-white/70 text-sm">Yearly</div>
          </div>
        </div>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/90 text-sm">Current Balance</p>
            <p className="text-4xl font-bold text-white">
              {coins.toLocaleString()} 🪙
            </p>
            <p className="text-white/70 text-sm mt-2">
              Ready to spend on your wishlist!
            </p>
          </div>
          <Coins className="w-16 h-16 text-white/30" />
        </div>
      </div>
    </div>
  )
}

