import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { CheckCircle2, Circle, Calendar, Plus } from 'lucide-react'
import TrackingInputModal from './TrackingInputModal'

const QUEST_TYPES = [
  { key: 'daily', label: 'Daily', color: 'bg-blue-500' },
  { key: 'weekly', label: 'Weekly', color: 'bg-green-500' },
  { key: 'monthly', label: 'Monthly', color: 'bg-purple-500' },
]

export default function QuestPanel({ onTypeChange }) {
  const { quests, completeQuest, updateQuestProgress, lastDailyLevelUpDate } = useStore()
  const [selectedType, setSelectedType] = useState('daily')
  const [trackingModal, setTrackingModal] = useState({ isOpen: false, quest: null })

  // Notify parent of type changes
  useEffect(() => {
    if (onTypeChange) {
      onTypeChange(selectedType)
    }
  }, [selectedType, onTypeChange])

  const currentQuests = quests[selectedType] || []
  
  // Check if all daily quests are completed
  const allDailyCompleted = 
    selectedType === 'daily' &&
    currentQuests.length > 0 &&
    currentQuests.every((q) => q.completed)

  const handleAddProgress = (quest) => {
    const type = quest.trackingType
    if (type === 'unit') {
      // For unit type, just add 1
      updateQuestProgress(selectedType, quest.id, 1)
    } else {
      // For other types (time, steps, milliliters, calories, and legacy types), open modal
      setTrackingModal({ isOpen: true, quest })
    }
  }

  const handleConfirmTracking = (amount) => {
    if (trackingModal.quest) {
      updateQuestProgress(selectedType, trackingModal.quest.id, amount)
    }
    setTrackingModal({ isOpen: false, quest: null })
  }

  const formatCurrentAmount = (quest) => {
    const type = quest.trackingType
    const amount = quest.currentAmount || 0
    
    if ((type === 'milliliters' || type === 'drink') && amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'L'
    }
    if (type === 'steps' || type === 'walk' || type === 'calories' || type === 'eat') {
      return amount.toLocaleString()
    }
    return amount
  }

  const formatTargetAmount = (quest) => {
    const type = quest.trackingType
    const amount = quest.targetAmount || 0
    
    if ((type === 'milliliters' || type === 'drink') && amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'L'
    }
    if (type === 'steps' || type === 'walk' || type === 'calories' || type === 'eat') {
      return amount.toLocaleString()
    }
    return amount
  }

  return (
    <div className="space-y-6">
      {/* Quest Type Tabs */}
      <div className="flex gap-2 flex-wrap">
        {QUEST_TYPES.map((type) => (
          <button
            key={type.key}
            onClick={() => setSelectedType(type.key)}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              selectedType === type.key
                ? 'bg-gray-800 text-white shadow-lg scale-105 border-2 border-gray-600'
                : 'bg-gray-900/90 text-white hover:bg-gray-800/90 border-2 border-gray-700'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Quest Tracker */}
      {currentQuests.length > 0 && (
        <div className={`backdrop-blur-sm rounded-lg py-2 px-4 border-2 ${
          allDailyCompleted
            ? 'bg-black/90 border-yellow-500'
            : 'bg-amber-200/90 border-gray-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {allDailyCompleted && (
                <CheckCircle2 className="w-5 h-5 text-yellow-500" />
              )}
              <span className={`font-semibold text-sm ${
                allDailyCompleted
                  ? 'text-white'
                  : 'text-gray-900'
              }`} style={allDailyCompleted ? {} : { textShadow: '0 0 2px rgba(0,0,0,0.3), 0 0 4px rgba(0,0,0,0.2)' }}>
                {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Quest Tracker
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-bold text-base ${
                allDailyCompleted
                  ? 'text-white'
                  : 'text-gray-900'
              }`} style={allDailyCompleted ? {} : { textShadow: '0 0 2px rgba(0,0,0,0.3), 0 0 4px rgba(0,0,0,0.2)' }}>
                {currentQuests.filter((q) => q.completed).length}/{currentQuests.length}
              </span>
              {allDailyCompleted && lastDailyLevelUpDate && (
                <div className="flex items-center gap-1 text-xs text-yellow-300">
                  <Calendar className="w-4 h-4" />
                  {new Date(lastDailyLevelUpDate).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quests List */}
      <div className="space-y-3">
        {currentQuests.length === 0 ? (
          <div className="text-center py-8 bg-gray-900/90 rounded-lg backdrop-blur-sm border-2 border-gray-700">
          </div>
        ) : (
          currentQuests.map((quest) => (
            <div key={quest.id} className="flex items-center gap-3">
              <div
                className={`backdrop-blur-sm text-white rounded-lg py-2 px-4 shadow-md transition-all flex-1 border-2 ${
                  quest.completed
                    ? 'bg-black/90 border-yellow-500'
                    : 'bg-gray-900/90 border-gray-700 hover:border-gray-600 hover:bg-gray-800/90'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => completeQuest(selectedType, quest.id)}
                      disabled={quest.completed}
                      className={`flex-shrink-0 transition-all ${
                        quest.completed
                          ? 'text-yellow-500 cursor-not-allowed'
                          : 'text-gray-400 hover:text-green-500 hover:scale-110'
                      }`}
                    >
                      {quest.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3
                          className={`font-semibold text-base ${
                            quest.completed
                              ? 'text-white'
                              : 'text-white'
                          }`}
                        >
                          {quest.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-yellow-300 font-semibold">
                            +{quest.reward.coins} 🪙
                          </span>
                          {quest.completedAt && (
                            <div className="flex items-center gap-1 text-xs text-yellow-300">
                              <Calendar className="w-4 h-4" />
                              {new Date(quest.completedAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {quest.trackingType && quest.targetAmount !== null && (
                    <div className="flex-shrink-0">
                      <span className={`font-medium text-base ${
                        quest.completed
                          ? 'text-white'
                          : 'text-gray-300'
                      }`}>
                        {formatCurrentAmount(quest)}/{formatTargetAmount(quest)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {!quest.completed && quest.trackingType && quest.targetAmount !== null && (
                <button
                  onClick={() => handleAddProgress(quest)}
                  className="bg-gray-900/90 hover:bg-gray-800/90 text-white p-2 rounded-lg transition-all hover:scale-110 flex-shrink-0 border-2 border-gray-700"
                  title="Add progress"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Tracking Input Modal */}
      <TrackingInputModal
        isOpen={trackingModal.isOpen}
        onClose={() => setTrackingModal({ isOpen: false, quest: null })}
        onConfirm={handleConfirmTracking}
        trackingType={trackingModal.quest?.trackingType}
        questTitle={trackingModal.quest?.title}
      />
    </div>
  )
}

