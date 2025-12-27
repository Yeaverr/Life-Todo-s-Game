import { useState } from 'react'
import { useStore } from '../store/useStore'
import { X } from 'lucide-react'

const QUEST_TYPES = [
  { key: 'daily', label: 'Daily', description: 'Repeatable daily tasks' },
  { key: 'weekly', label: 'Weekly', description: 'Complete within a week' },
  { key: 'monthly', label: 'Monthly', description: 'Complete within a month' },
  { key: 'yearly', label: 'Yearly', description: 'Long-term goals' },
]

const TRACKING_TYPES = [
  { key: 'unit', label: 'Unit', unit: 'times' },
  { key: 'steps', label: 'Steps', unit: 'steps' },
  { key: 'time', label: 'Time', unit: 'minutes' },
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'milliliters', label: 'Milliliters', unit: 'ml' },
]

export default function AddQuestModal({ onClose }) {
  const { addQuest } = useStore()
  const [type, setType] = useState('daily')
  const [title, setTitle] = useState('')
  const [trackingType, setTrackingType] = useState('unit')
  const [targetAmount, setTargetAmount] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) {
      return
    }
    
    // Validate target amount is provided
    const amount = targetAmount ? parseFloat(targetAmount) : null
    if (amount === null || amount <= 0) {
      return
    }

    addQuest(type, { 
      title: title.trim(), 
      trackingType: trackingType,
      targetAmount: amount,
    })
    setTitle('')
    setTargetAmount('')
    setTrackingType('unit')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full p-6 border-2 border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Quest</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quest Type */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
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
                      ? 'border-purple-500 bg-purple-500/20 text-white font-semibold'
                      : 'border-gray-700 hover:border-gray-600 text-gray-300 bg-gray-800'
                  }`}
                >
                  <div className="font-semibold">{qt.label}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {qt.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Quest Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Brush teeth"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-500"
              required
            />
          </div>

          {/* Tracking Type */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Tracking Type
            </label>
            <select
              value={trackingType}
              onChange={(e) => setTrackingType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white"
            >
              {TRACKING_TYPES.map((tt) => (
                <option key={tt.key} value={tt.key} className="bg-gray-800">
                  {tt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Target Amount */}
          {trackingType !== 'unit' && (
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Target Amount ({TRACKING_TYPES.find(t => t.key === trackingType)?.unit}) *
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder={`e.g., ${trackingType === 'time' ? '30' : trackingType === 'steps' ? '10000' : trackingType === 'milliliters' ? '2000' : trackingType === 'calories' ? '2000' : '2000'}`}
                min="0"
                step={trackingType === 'time' || trackingType === 'page' ? '1' : '0.1'}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-500"
                required={trackingType !== 'unit'}
              />
            </div>
          )}

          {/* Unit Amount (for unit type) */}
          {trackingType === 'unit' && (
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                How Many Times? *
              </label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="e.g., 2"
                min="1"
                step="1"
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-500"
                required
              />
            </div>
          )}

          {/* Rewards Preview */}
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <p className="text-sm font-semibold text-white mb-2">
              Rewards for completing:
            </p>
            <div className="flex gap-4 text-sm">
              <span className="text-yellow-300">
                +{type === 'daily' ? 5 : type === 'weekly' ? 25 : type === 'monthly' ? 100 : 500} 🪙
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-700 rounded-lg text-white hover:bg-gray-800 font-bold transition-all bg-gray-900/90"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all hover:scale-105"
            >
              Add Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

