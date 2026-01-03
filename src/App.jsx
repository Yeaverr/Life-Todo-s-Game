import { useState, useEffect } from 'react'
import { useStore } from './store/useStore'
import { useFirebaseSync } from './hooks/useFirebaseSync'
import Header from './components/Header'
import QuestPanel from './components/QuestPanel'
import StatsPanel from './components/StatsPanel'
import PurchasePanel from './components/PurchasePanel'
import QuestManagementPanel from './components/QuestManagementPanel'
import AddQuestModal from './components/AddQuestModal'
import AddPurchaseModal from './components/AddPurchaseModal'
import DateDisplay from './components/DateDisplay'

function App() {
  const { resetDailyQuests, resetWeeklyQuests, resetMonthlyQuests, checkQuestsNeedRefresh } = useStore()
  
  // Initialize Firebase sync
  useFirebaseSync()
  const [activeTab, setActiveTab] = useState('quests')
  const [selectedQuestType, setSelectedQuestType] = useState('daily')
  const [showAddQuest, setShowAddQuest] = useState(false)
  const [showAddPurchase, setShowAddPurchase] = useState(false)

  // Check for daily, weekly, and monthly resets
  useEffect(() => {
    const checkResets = () => {
      resetDailyQuests()
      resetWeeklyQuests()
      resetMonthlyQuests()
    }

    // Check immediately on mount
    checkResets()

    // Set up interval to check every minute
    const interval = setInterval(checkResets, 60000)

    // Also set up a timeout for the next midnight
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    const msUntilMidnight = tomorrow.getTime() - now.getTime()

    const midnightTimeout = setTimeout(() => {
      checkResets()
      // After first midnight, check every minute
      setInterval(checkResets, 60000)
    }, msUntilMidnight)

    return () => {
      clearInterval(interval)
      clearTimeout(midnightTimeout)
    }
  }, [resetDailyQuests, resetWeeklyQuests, resetMonthlyQuests])

  // 1:00 AM safety check to verify quests are refreshed
  useEffect(() => {
    const checkAndRefreshAt1AM = () => {
      const now = new Date()
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      
      // Check if it's 1:00 AM (or 1:01 AM to allow some buffer)
      if (currentHour === 1 && currentMinute <= 1) {
        // Check if quests need refreshing
        const needsRefresh = checkQuestsNeedRefresh()
        
        if (needsRefresh) {
          console.log('⚠️ 1:00 AM Check: Quests need refresh, forcing reset and reloading page')
          // Force reset all quests
          resetDailyQuests()
          resetWeeklyQuests()
          resetMonthlyQuests()
          
          // Wait a moment for state to update, then reload
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        } else {
          console.log('✅ 1:00 AM Check: Quests are properly refreshed')
        }
      }
    }

    // Check immediately if it's around 1:00 AM
    checkAndRefreshAt1AM()

    // Set up interval to check every minute
    const oneAMInterval = setInterval(checkAndRefreshAt1AM, 60000)

    // Also set up a timeout for the next 1:00 AM
    const now = new Date()
    const next1AM = new Date(now)
    next1AM.setHours(1, 0, 0, 0)
    
    // If it's already past 1:00 AM today, set for tomorrow
    if (now.getHours() >= 1 && now.getMinutes() > 1) {
      next1AM.setDate(next1AM.getDate() + 1)
    }
    
    const msUntil1AM = next1AM.getTime() - now.getTime()

    const oneAMTimeout = setTimeout(() => {
      checkAndRefreshAt1AM()
      // After first 1:00 AM check, check every minute
      setInterval(checkAndRefreshAt1AM, 60000)
    }, msUntil1AM)

    return () => {
      clearInterval(oneAMInterval)
      clearTimeout(oneAMTimeout)
    }
  }, [checkQuestsNeedRefresh, resetDailyQuests, resetWeeklyQuests, resetMonthlyQuests])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-8">
      <Header />
      
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Tab Navigation */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('quests')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
              activeTab === 'quests'
                ? 'bg-gray-800 text-white shadow-lg scale-105 border-2 border-gray-600'
                : 'bg-gray-900/90 text-white hover:bg-gray-800/90 border-2 border-gray-700'
            }`}
          >
            🎯 Quests
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
              activeTab === 'stats'
                ? 'bg-gray-800 text-white shadow-lg scale-105 border-2 border-gray-600'
                : 'bg-gray-900/90 text-white hover:bg-gray-800/90 border-2 border-gray-700'
            }`}
          >
            📊 Stats
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
              activeTab === 'purchases'
                ? 'bg-gray-800 text-white shadow-lg scale-105 border-2 border-gray-600'
                : 'bg-gray-900/90 text-white hover:bg-gray-800/90 border-2 border-gray-700'
            }`}
          >
            🛒 Purchases
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
              activeTab === 'manage'
                ? 'bg-gray-800 text-white shadow-lg scale-105 border-2 border-gray-600'
                : 'bg-gray-900/90 text-white hover:bg-gray-800/90 border-2 border-gray-700'
            }`}
          >
            ⚙️ Manage
          </button>
        </div>

        {/* Content */}
        {activeTab === 'quests' && (
          <div>
            <div className="flex flex-col gap-3 mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Quests</h2>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                <div className="flex-1">
                  <DateDisplay selectedType={selectedQuestType} />
                </div>
                <button
                  onClick={() => setShowAddQuest(true)}
                  className="bg-gray-900/90 hover:bg-gray-800/90 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-bold shadow-lg transition-all hover:scale-105 border-2 border-gray-700 text-xs sm:text-sm whitespace-nowrap"
                >
                  Add Quest
                </button>
              </div>
            </div>
            <QuestPanel onTypeChange={setSelectedQuestType} />
          </div>
        )}

        {activeTab === 'stats' && <StatsPanel />}

        {activeTab === 'manage' && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Manage Your Quests</h2>
            <QuestManagementPanel />
          </div>
        )}

        {activeTab === 'purchases' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">My Purchases</h2>
              <button
                onClick={() => setShowAddPurchase(true)}
                className="bg-gray-900/90 hover:bg-gray-800/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold shadow-lg transition-all hover:scale-105 border-2 border-gray-700 text-sm sm:text-base w-full sm:w-auto"
              >
                + Record Purchase
              </button>
            </div>
            <PurchasePanel />
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddQuest && (
        <AddQuestModal onClose={() => setShowAddQuest(false)} />
      )}
      {showAddPurchase && (
        <AddPurchaseModal onClose={() => setShowAddPurchase(false)} />
      )}
    </div>
  )
}

export default App

