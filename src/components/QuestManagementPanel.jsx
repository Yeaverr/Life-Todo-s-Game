import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Edit, Trash2, X, Save } from 'lucide-react'

const QUEST_TYPES = [
  { key: 'daily', label: 'Daily', color: 'bg-blue-500' },
  { key: 'weekly', label: 'Weekly', color: 'bg-green-500' },
  { key: 'monthly', label: 'Monthly', color: 'bg-purple-500' },
]

const TRACKING_TYPES = [
  { key: 'unit', label: 'Unit', unit: 'times' },
  { key: 'steps', label: 'Steps', unit: 'steps' },
  { key: 'time', label: 'Time', unit: 'minutes' },
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'milliliters', label: 'Milliliters', unit: 'ml' },
  { key: 'pages', label: 'Pages', unit: 'pages' },
]

export default function QuestManagementPanel() {
  const { quests, updateQuest, deleteQuest } = useStore()
  const [selectedType, setSelectedType] = useState('daily')
  const [editingQuest, setEditingQuest] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    trackingType: 'unit',
    targetAmount: '',
  })

  const currentQuests = quests[selectedType] || []

  const handleEdit = (quest) => {
    setEditingQuest(quest.id)
    setEditForm({
      title: quest.title,
      trackingType: quest.trackingType || 'unit',
      targetAmount: quest.targetAmount?.toString() || '',
    })
  }

  const handleSave = (questId) => {
    const amount = editForm.targetAmount ? parseFloat(editForm.targetAmount) : null
    if (!editForm.title.trim() || (amount !== null && amount <= 0)) {
      return
    }

    updateQuest(selectedType, questId, {
      title: editForm.title.trim(),
      trackingType: editForm.trackingType,
      targetAmount: amount,
    })

    setEditingQuest(null)
    setEditForm({ title: '', trackingType: 'unit', targetAmount: '' })
  }

  const handleCancel = () => {
    setEditingQuest(null)
    setEditForm({ title: '', trackingType: 'unit', targetAmount: '' })
  }

  const handleDelete = (questId) => {
    if (window.confirm('Are you sure you want to delete this quest?')) {
      deleteQuest(selectedType, questId)
    }
  }

  const formatAmount = (quest) => {
    const trackingType = quest.trackingType || 'unit'
    const type = TRACKING_TYPES.find((t) => t.key === trackingType)
    if (!type) return quest.targetAmount || 0

    if (trackingType === 'unit') {
      return `${quest.targetAmount || 0} ${type.unit}`
    }
    return `${quest.targetAmount || 0} ${type.unit}`
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quest Type Tabs */}
      <div className="flex gap-2 flex-wrap">
        {QUEST_TYPES.map((qt) => (
          <button
            key={qt.key}
            onClick={() => {
              setSelectedType(qt.key)
              setEditingQuest(null)
            }}
            className={`px-3 sm:px-4 py-2 rounded-lg font-bold transition-all border-2 text-sm sm:text-base ${
              selectedType === qt.key
                ? 'bg-gray-800 text-white shadow-lg scale-105 border-gray-600'
                : 'bg-gray-900/90 text-white hover:bg-gray-800/90 border-gray-700'
            }`}
          >
            {qt.label}
          </button>
        ))}
      </div>

      {/* Quest List */}
      {currentQuests.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-900/90 rounded-lg border-2 border-gray-700">
          <p className="text-gray-400 text-base sm:text-lg">No {selectedType} quests yet.</p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2 px-4">
            Add quests from the Quests tab to manage them here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentQuests.map((quest) => (
            <div
              key={quest.id}
              className="bg-gray-900/90 rounded-lg p-3 sm:p-4 border-2 border-gray-700"
            >
              {editingQuest === quest.id ? (
                <div className="space-y-4">
                  {/* Edit Form */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Quest Title *
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white"
                      placeholder="Quest title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Tracking Type
                    </label>
                    <select
                      value={editForm.trackingType}
                      onChange={(e) =>
                        setEditForm({ ...editForm, trackingType: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white"
                    >
                      {TRACKING_TYPES.map((tt) => (
                        <option key={tt.key} value={tt.key} className="bg-gray-800">
                          {tt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Target Amount (
                      {TRACKING_TYPES.find((t) => t.key === editForm.trackingType)?.unit})
                      ) *
                    </label>
                    <input
                      type="text"
                      inputMode={editForm.trackingType === 'time' || editForm.trackingType === 'steps' ? 'numeric' : 'decimal'}
                      value={editForm.targetAmount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                        setEditForm({ ...editForm, targetAmount: value })
                      }}
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Target amount"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(quest.id)}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-all border border-gray-700 flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-base sm:text-lg">{quest.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-gray-300 text-xs sm:text-sm">
                        Target: {formatAmount(quest)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(quest)}
                      className="p-1.5 sm:p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all hover:scale-105 border border-gray-700"
                      title="Edit quest"
                    >
                      <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(quest.id)}
                      className="p-1.5 sm:p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all hover:scale-105 border border-gray-700"
                      title="Delete quest"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

