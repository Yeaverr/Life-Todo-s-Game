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

function App() {
  const { resetDailyQuests, resetWeeklyQuests, resetMonthlyQuests } = useStore()
  
  // Initialize Firebase sync
  useFirebaseSync()
  const [activeTab, setActiveTab] = useState('quests')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('quests')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'quests'
                ? 'bg-gray-800 text-white shadow-lg scale-105 border-2 border-gray-600'
                : 'bg-gray-900/90 text-white hover:bg-gray-800/90 border-2 border-gray-700'
            }`}
          >
            🎯 Quests
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'stats'
                ? 'bg-gray-800 text-white shadow-lg scale-105 border-2 border-gray-600'
                : 'bg-gray-900/90 text-white hover:bg-gray-800/90 border-2 border-gray-700'
            }`}
          >
            📊 Stats
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'purchases'
                ? 'bg-gray-800 text-white shadow-lg scale-105 border-2 border-gray-600'
                : 'bg-gray-900/90 text-white hover:bg-gray-800/90 border-2 border-gray-700'
            }`}
          >
            🛒 Purchases
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'manage'
                ? 'bg-gray-800 text-white shadow-lg scale-105 border-2 border-gray-600'
                : 'bg-gray-900/90 text-white hover:bg-gray-800/90 border-2 border-gray-700'
            }`}
          >
            ⚙️ Manage Quests
          </button>
        </div>

        {/* Content */}
        {activeTab === 'quests' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Your Quests</h2>
              <button
                onClick={() => setShowAddQuest(true)}
                className="bg-gray-900/90 hover:bg-gray-800/90 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all hover:scale-105 border-2 border-gray-700"
              >
                + Add Quest
              </button>
            </div>
            <QuestPanel />
          </div>
        )}

        {activeTab === 'stats' && <StatsPanel />}

        {activeTab === 'manage' && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Manage Your Quests</h2>
            <QuestManagementPanel />
          </div>
        )}

        {activeTab === 'purchases' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">My Purchases</h2>
              <button
                onClick={() => setShowAddPurchase(true)}
                className="bg-gray-900/90 hover:bg-gray-800/90 text-white px-6 py-3 rounded-lg font-bold shadow-lg transition-all hover:scale-105 border-2 border-gray-700"
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

