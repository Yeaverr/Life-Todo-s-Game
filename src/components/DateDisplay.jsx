import { Calendar } from 'lucide-react'

export default function DateDisplay({ selectedType = 'daily' }) {
  const getDateDisplay = () => {
    const now = new Date()
    
    switch (selectedType) {
      case 'daily': {
        const day = now.getDate()
        const month = now.toLocaleDateString('en-US', { month: 'long' })
        const weekday = now.toLocaleDateString('en-US', { weekday: 'long' })
        const year = now.getFullYear()
        return `${day} ${month}, ${weekday}, ${year}`
      }
      
      case 'weekly': {
        // Get Monday of current week
        const day = now.getDay()
        const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
        const monday = new Date(now.getFullYear(), now.getMonth(), diff)
        const sunday = new Date(monday)
        sunday.setDate(monday.getDate() + 6)
        
        const formatDate = (date) => date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
        
        return `${formatDate(monday)} - ${formatDate(sunday)}`
      }
      
      case 'monthly':
        return now.toLocaleDateString('en-US', {
          month: 'long'
        })
      
      default: {
        const day = now.getDate()
        const month = now.toLocaleDateString('en-US', { month: 'long' })
        const weekday = now.toLocaleDateString('en-US', { weekday: 'long' })
        const year = now.getFullYear()
        return `${day} ${month}, ${weekday}, ${year}`
      }
    }
  }

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 justify-center border-2 border-gray-700 w-full">
      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
      <span className="text-white font-bold text-xs sm:text-sm md:text-base">{getDateDisplay()}</span>
    </div>
  )
}

