import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const TRACKING_UNITS = {
  time: 'minutes',
  steps: 'steps',
  milliliters: 'ml',
  calories: 'kcal',
  // Legacy support
  walk: 'steps',
  drink: 'ml',
  eat: 'kcal',
}

export default function TrackingInputModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  trackingType, 
  questTitle 
}) {
  const [amount, setAmount] = useState('')

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return
    
    // Save the current overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow
    // Disable scrolling on the body
    document.body.style.overflow = 'hidden'
    
    // Re-enable scrolling when component unmounts or modal closes
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (numAmount > 0) {
      onConfirm(numAmount)
      setAmount('')
      onClose()
    }
  }

  const unit = TRACKING_UNITS[trackingType] || ''

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
          <h2 className="text-2xl font-bold text-white">Add Progress</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              {questTitle}
            </label>
            <p className="text-sm text-gray-400 mb-4">
              How many {unit} did you complete?
            </p>
            <input
              type="text"
              inputMode={trackingType === 'time' || trackingType === 'steps' ? 'numeric' : 'decimal'}
              value={amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                setAmount(value)
              }}
              placeholder={`Enter amount in ${unit}`}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
              autoFocus
            />
          </div>

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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

