import { useState } from 'react'
import { useStore } from '../store/useStore'
import { X, AlertCircle } from 'lucide-react'

export default function AddPurchaseModal({ onClose }) {
  const { addPurchase, coins } = useStore()
  const [name, setName] = useState('')
  const [coinCost, setCoinCost] = useState('')
  const [realCost, setRealCost] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const coinCostNum = parseInt(coinCost)
    const realCostNum = realCost ? parseFloat(realCost) : null
    
    if (!name.trim()) {
      setError('Please enter an item name')
      return
    }
    
    if (coinCostNum <= 0 || isNaN(coinCostNum)) {
      setError('Coin cost must be greater than 0')
      return
    }

    if (realCostNum !== null && (realCostNum <= 0 || isNaN(realCostNum))) {
      setError('Real-life cost must be greater than 0')
      return
    }

    if (coins < coinCostNum) {
      setError(`Insufficient coins! You have ${coins.toLocaleString()} 🪙 but need ${coinCostNum.toLocaleString()} 🪙`)
      return
    }

    // Add purchase (will deduct coins automatically)
    addPurchase({
      name: name.trim(),
      description: '',
      cost: coinCostNum,
      realCost: realCostNum,
    })

    // If we get here, purchase was successful (store handles validation)
    setName('')
    setCoinCost('')
    setRealCost('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full p-6 border-2 border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Record Purchase</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Item Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., T-Shirt"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-500"
              required
            />
          </div>

          {/* Coin Cost */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Coin Cost (in coins) *
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={coinCost}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                setCoinCost(value)
              }}
              placeholder="e.g., 500"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Current balance: {coins.toLocaleString()} 🪙
            </p>
            {parseInt(coinCost) > 0 && coins < parseInt(coinCost) && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                You need {parseInt(coinCost).toLocaleString()} 🪙 but only have {coins.toLocaleString()} 🪙
              </p>
            )}
          </div>

          {/* Real-Life Cost */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Real-Life Cost (optional)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={realCost}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
                setRealCost(value)
              }}
              placeholder="e.g., 29.99"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-800 text-white placeholder-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Enter the actual money you spent (e.g., $29.99)
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
              <p className="text-sm text-red-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {error}
              </p>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
            <p className="text-sm text-blue-300">
              💡 <strong>How it works:</strong> When you buy something in real life, 
              record it here with both coin cost and real-life cost. The coins will be deducted from your balance. 
              Complete quests to earn more coins!
            </p>
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
              disabled={parseInt(coinCost) > 0 && coins < parseInt(coinCost)}
              className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all ${
                parseInt(coinCost) > 0 && coins < parseInt(coinCost)
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

