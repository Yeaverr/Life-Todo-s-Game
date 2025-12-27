import { useState } from 'react'
import { useStore } from '../store/useStore'
import { X, AlertCircle } from 'lucide-react'

export default function AddPurchaseModal({ onClose }) {
  const { addPurchase, coins } = useStore()
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const costNum = parseInt(cost)
    
    if (!name.trim()) {
      setError('Please enter an item name')
      return
    }
    
    if (costNum <= 0 || isNaN(costNum)) {
      setError('Cost must be greater than 0')
      return
    }

    if (coins < costNum) {
      setError(`Insufficient coins! You have ${coins.toLocaleString()} 🪙 but need ${costNum.toLocaleString()} 🪙`)
      return
    }

    // Add purchase (will deduct coins automatically)
    addPurchase({
      name: name.trim(),
      description: '',
      cost: costNum,
    })

    // If we get here, purchase was successful (store handles validation)
    setName('')
    setCost('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Record Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., T-Shirt"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cost (in coins) *
            </label>
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="e.g., 500"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Current balance: {coins.toLocaleString()} 🪙
            </p>
            {parseInt(cost) > 0 && coins < parseInt(cost) && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                You need {parseInt(cost).toLocaleString()} 🪙 but only have {coins.toLocaleString()} 🪙
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <p className="text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </p>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-700">
              💡 <strong>How it works:</strong> When you buy something in real life, 
              record it here and the coins will be deducted from your balance. 
              Complete quests to earn more coins!
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={parseInt(cost) > 0 && coins < parseInt(cost)}
              className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all ${
                parseInt(cost) > 0 && coins < parseInt(cost)
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105'
              }`}
            >
              Record Purchase
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

