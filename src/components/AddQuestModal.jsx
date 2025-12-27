import { useState } from 'react'
import { useStore } from '../store/useStore'
import { X } from 'lucide-react'

const QUEST_TYPES = [
  { key: 'daily', label: 'Daily', description: 'Repeatable daily tasks' },
  { key: 'weekly', label: 'Weekly', description: 'Complete within a week' },
  { key: 'monthly', label: 'Monthly', description: 'Complete within a month' },
  { key: 'yearly', label: 'Yearly', description: 'Long-term goals' },
]

export default function AddQuestModal({ onClose }) {
  const { addQuest } = useStore()
  const [type, setType] = useState('daily')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      addQuest(type, { title: title.trim(), description: description.trim() })
      setTitle('')
      setDescription('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Quest</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quest Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quest Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {QUEST_TYPES.map((qt) => (
                <button
                  key={qt.key}
                  type="button"
                  onClick={() => setType(qt.key)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    type === qt.key
                      ? 'border-purple-500 bg-purple-50 text-purple-700 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-semibold">{qt.label}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {qt.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quest Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Exercise for 30 minutes"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about this quest..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Rewards Preview */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <p className="text-sm font-semibold text-purple-700 mb-2">
              Rewards for completing:
            </p>
            <div className="flex gap-4 text-sm">
              <span className="text-purple-600">
                +{type === 'daily' ? 10 : type === 'weekly' ? 50 : type === 'monthly' ? 200 : 1000} XP
              </span>
              <span className="text-yellow-600">
                +{type === 'daily' ? 5 : type === 'weekly' ? 25 : type === 'monthly' ? 100 : 500} 🪙
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all hover:scale-105"
            >
              Add Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

