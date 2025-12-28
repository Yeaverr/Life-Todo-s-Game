import { useStore } from '../store/useStore'
import { ShoppingBag, Coins, Calendar } from 'lucide-react'

export default function PurchasePanel() {
  const { purchases } = useStore()

  return (
    <div className="space-y-4 sm:space-y-6">
      {purchases.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-900/90 rounded-lg backdrop-blur-sm border-2 border-gray-700">
          <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-white/50 mx-auto mb-3 sm:mb-4" />
          <p className="text-white text-base sm:text-lg px-4">
            No purchases recorded yet. Record your real-life purchases here! 🛒
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {purchases.map((purchase) => {
            return (
              <div
                key={purchase.id}
                className="bg-gray-900/90 rounded-lg p-3 sm:p-4 border-2 border-gray-700 shadow-lg transition-all hover:border-gray-600"
              >
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-white mb-2">
                      {purchase.name}
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300 flex-shrink-0" />
                        <span className="text-yellow-300 font-semibold text-sm sm:text-base">
                          {purchase.cost.toLocaleString()} 🪙
                        </span>
                        <span className="text-gray-400 text-xs sm:text-sm">(spent)</span>
                      </div>
                      {purchase.realCost && (
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-blue-300 font-semibold text-sm sm:text-base">
                            ${purchase.realCost.toFixed(2)}
                          </span>
                          <span className="text-gray-400 text-xs sm:text-sm">(real cost)</span>
                        </div>
                      )}
                      {purchase.purchasedAt && (
                        <div className="flex items-center gap-1 text-gray-400 text-xs sm:text-sm">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>
                            {new Date(purchase.purchasedAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-blue-300/30">
        <p className="text-white text-xs sm:text-sm">
          💡 <strong>How it works:</strong> When you buy something in real life, 
          record it here and coins will be deducted. Complete quests to earn more coins 
          for your next purchase!
        </p>
      </div>
    </div>
  )
}

