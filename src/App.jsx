import { useState } from 'react'
import { useStore } from './store/useStore'
import Header from './components/Header'
import QuestPanel from './components/QuestPanel'
import StatsPanel from './components/StatsPanel'
import PurchasePanel from './components/PurchasePanel'
import AddQuestModal from './components/AddQuestModal'
import AddPurchaseModal from './components/AddPurchaseModal'

function App() {
  const [activeTab, setActiveTab] = useState('quests')
  const [showAddQuest, setShowAddQuest] = useState(false)
  const [showAddPurchase, setShowAddPurchase] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('quests')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'quests'
                ? 'bg-white text-purple-600 shadow-lg scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            🎯 Quests
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'stats'
                ? 'bg-white text-purple-600 shadow-lg scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            📊 Stats
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'purchases'
                ? 'bg-white text-purple-600 shadow-lg scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            🛒 Purchases
          </button>
        </div>

        {/* Content */}
        {activeTab === 'quests' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Your Quests</h2>
              <button
                onClick={() => setShowAddQuest(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105"
              >
                + Add Quest
              </button>
            </div>
            <QuestPanel />
          </div>
        )}

        {activeTab === 'stats' && <StatsPanel />}

        {activeTab === 'purchases' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Wishlist</h2>
              <button
                onClick={() => setShowAddPurchase(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all hover:scale-105"
              >
                + Add Item
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

