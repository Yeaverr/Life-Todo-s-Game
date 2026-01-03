import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { X } from 'lucide-react'

const QUEST_TYPES = [
  { key: 'daily', label: 'Daily', description: 'Repeatable daily tasks' },
  { key: 'weekly', label: 'Weekly', description: 'Complete within a week' },
  { key: 'monthly', label: 'Monthly', description: 'Complete within a month' },
]

const TRACKING_TYPES = [
  { key: 'unit', label: 'Unit', unit: 'times' },
  { key: 'steps', label: 'Steps', unit: 'steps' },
  { key: 'time', label: 'Time', unit: 'minutes' },
  { key: 'calories', label: 'Calories', unit: 'kcal' },
  { key: 'milliliters', label: 'Milliliters', unit: 'ml' },
  { key: 'pages', label: 'Pages', unit: 'pages' },
]

export default function AddQuestModal({ onClose }) {
  const { addQuest } = useStore()
  const [type, setType] = useState('daily')
  const [title, setTitle] = useState('')
  const [trackingType, setTrackingType] = useState('unit')
  const [targetAmount, setTargetAmount] = useState('')

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Save the current overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow
    // Disable scrolling on the body
    document.body.style.overflow = 'hidden'
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

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
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchMove={(e) => {
        // Prevent scrolling the background when touching the backdrop
        if (e.target === e.currentTarget) {
          e.preventDefault()
        }
      }}
    >
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 border-2 border-gray-700 my-auto">
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
                type="text"
                inputMode={trackingType === 'time' || trackingType === 'steps' || trackingType === 'pages' ? 'numeric' : 'decimal'}
                value={targetAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                  setTargetAmount(value)
                }}
                placeholder={`e.g., ${trackingType === 'time' ? '30' : trackingType === 'steps' ? '10000' : trackingType === 'milliliters' ? '2000' : trackingType === 'calories' ? '2000' : trackingType === 'pages' ? '30' : '2000'}`}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={targetAmount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  setTargetAmount(value)
                }}
                placeholder="e.g., 2"
                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              className="flex-1 px-4 py-3 border border-gray-700 rounded-lg text-white hover:bg-gray-800 font-bold transition-all bg-gray-900/90 touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all active:scale-95 touch-manipulation"
            >
              Add Quest
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

