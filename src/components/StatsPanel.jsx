import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Trophy, Coins, Target, TrendingUp, Calendar as CalendarIcon } from 'lucide-react'

// Get week number of the year
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

export default function StatsPanel() {
  const {
    dailyLevel,
    weeklyLevel,
    totalXP,
    coins,
    totalEarned,
    quests,
    completedDays,
    completedWeeks,
    totalQuestsCompleted,
    totalDailyQuestsCompleted,
    totalWeeklyQuestsCompleted,
    totalMonthlyQuestsCompleted,
  } = useStore()

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Calculate statistics
  const totalQuests = Object.values(quests).flat().length
  const completedQuests = Object.values(quests)
    .flat()
    .filter((q) => q.completed).length
  const completionRate =
    totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0

  // Use total all-time quest completions instead of current period
  const questsByType = {
    daily: totalDailyQuestsCompleted,
    weekly: totalWeeklyQuestsCompleted,
    monthly: totalMonthlyQuestsCompleted,
  }

  // Calculate monthly completion stats
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  
  const completedDaysThisMonth = completedDays.filter((day) => {
    const date = new Date(day)
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }).length

  // Calculate weekly completion stats for current month
  // Get all weeks that fall within the current month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstWeek = getWeekNumber(firstDayOfMonth)
  const lastWeek = getWeekNumber(lastDayOfMonth)
  
  // Count unique weeks in the month
  const weeksInMonthSet = new Set()
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    const weekNum = getWeekNumber(date)
    weeksInMonthSet.add(weekNum)
  }
  const weeksInMonth = weeksInMonthSet.size
  
  // Count completed weeks that fall in this month
  const completedWeeksThisMonth = completedWeeks.filter((week) => {
    const [year, weekNum] = week.split('-')
    const weekNumber = parseInt(weekNum)
    return year === String(currentYear) && weeksInMonthSet.has(weekNumber)
  }).length

  // Calendar generation
  const generateCalendar = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1)
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const calendar = []
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push({ day: null, date: null })
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const isCompleted = completedDays.includes(dateStr)
      calendar.push({ day, date: dateStr, isCompleted })
    }

    return { calendar, weekDays }
  }

  const { calendar, weekDays } = generateCalendar()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Your Statistics</h2>

      {/* Quest Completion by Type */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
          Quests Completed by Type
        </h3>
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-gray-700 shadow-lg">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400">
              {questsByType.daily}
            </div>
            <div className="text-white/70 text-xs sm:text-sm">Daily</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-400">
              {questsByType.weekly}
            </div>
            <div className="text-white/70 text-xs sm:text-sm">Weekly</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-400">
              {questsByType.monthly}
            </div>
            <div className="text-white/70 text-xs sm:text-sm">Monthly</div>
          </div>
        </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Completion Card */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-gray-700 shadow-lg">
          <div className="flex items-center gap-3 sm:gap-4">
            <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-white/70 text-xs sm:text-sm font-semibold">Monthly Completion</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {completedDaysThisMonth}/{daysInMonth}
              </p>
              <p className="text-white/60 text-xs mt-1">
                Days completed in {monthNames[currentMonth]}
              </p>
            </div>
          </div>
        </div>

        {/* Expected Monthly Completion Card */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-4 sm:p-6 border-2 border-gray-700 shadow-lg">
          <div className="flex items-center gap-3 sm:gap-4">
            <Target className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-white/70 text-xs sm:text-sm font-semibold">Expected Completion</p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {now.getDate()}/{daysInMonth}
              </p>
              <p className="text-white/60 text-xs mt-1">
                Current day in {monthNames[currentMonth]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 sm:p-6 border-2 border-gray-700 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white">Completion Calendar</h3>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handlePrevMonth}
              className="px-2 sm:px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-all border border-gray-700 text-sm sm:text-base"
            >
              ←
            </button>
            <span className="text-white font-bold text-sm sm:text-lg text-center flex-1 sm:flex-none sm:min-w-[150px] sm:min-w-[200px]">
              {monthNames[selectedMonth]} {selectedYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="px-2 sm:px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-all border border-gray-700 text-sm sm:text-base"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs sm:text-sm font-bold text-gray-400 py-1 sm:py-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendar.map((item, index) => (
            <div
              key={index}
              className={`aspect-square flex items-center justify-center rounded-lg border-2 transition-all ${
                item.day === null
                  ? 'border-transparent'
                  : item.isCompleted
                  ? 'bg-green-500/30 border-green-500 text-white font-bold'
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {item.day !== null && (
                <span className={`text-xs sm:text-sm ${item.isCompleted ? 'text-green-300' : 'text-gray-400'}`}>
                  {item.day}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3 sm:mt-4 flex items-center gap-2 sm:gap-4 justify-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500/30 border-2 border-green-500 rounded"></div>
            <span className="text-xs sm:text-sm text-gray-400">All quests completed</span>
          </div>
        </div>
      </div>


    </div>
  )
}
