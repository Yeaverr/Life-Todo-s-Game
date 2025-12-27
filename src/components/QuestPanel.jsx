import { useState } from 'react'
import { useStore } from '../store/useStore'
import { CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react'

const QUEST_TYPES = [
  { key: 'daily', label: 'Daily', color: 'bg-blue-500' },
  { key: 'weekly', label: 'Weekly', color: 'bg-green-500' },
  { key: 'monthly', label: 'Monthly', color: 'bg-purple-500' },
  { key: 'yearly', label: 'Yearly', color: 'bg-orange-500' },
]

export default function QuestPanel() {
  const { quests, completeQuest, deleteQuest } = useStore()
  const [selectedType, setSelectedType] = useState('daily')

  const currentQuests = quests[selectedType] || []

  return (
    <div className="space-y-6">
      {/* Quest Type Tabs */}
      <div className="flex gap-2 flex-wrap">
        {QUEST_TYPES.map((type) => (
          <button
            key={type.key}
            onClick={() => setSelectedType(type.key)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedType === type.key
                ? `${type.color} text-white shadow-lg scale-105`
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Quests List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {currentQuests.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-white text-lg">
              No {selectedType} quests yet. Add one to get started! 🚀
            </p>
          </div>
        ) : (
          currentQuests.map((quest) => (
            <div
              key={quest.id}
              className={`bg-white rounded-lg p-6 shadow-lg transition-all hover:scale-105 ${
                quest.completed
                  ? 'opacity-75 border-2 border-green-500'
                  : 'border-2 border-transparent hover:border-purple-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => completeQuest(selectedType, quest.id)}
                    disabled={quest.completed}
                    className={`mt-1 transition-all ${
                      quest.completed
                        ? 'text-green-500 cursor-not-allowed'
                        : 'text-gray-400 hover:text-green-500 hover:scale-110'
                    }`}
                  >
                    {quest.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-lg ${
                        quest.completed
                          ? 'line-through text-gray-500'
                          : 'text-gray-800'
                      }`}
                    >
                      {quest.title}
                    </h3>
                    {quest.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {quest.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteQuest(selectedType, quest.id)}
                  className="text-red-400 hover:text-red-600 transition-all hover:scale-110"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Rewards */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-purple-600 font-semibold">
                    +{quest.reward.xp} XP
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-yellow-600 font-semibold">
                    +{quest.reward.coins} 🪙
                  </span>
                </div>
                {quest.completedAt && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                    <Calendar className="w-4 h-4" />
                    {new Date(quest.completedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

