import { useStore } from '../store/useStore'
import { ShoppingBag, CheckCircle2, Trash2, Coins } from 'lucide-react'

export default function PurchasePanel() {
  const { purchases, coins, buyPurchase, deletePurchase } = useStore()

  const canAfford = (cost) => coins >= cost

  return (
    <div className="space-y-6">
      {purchases.length === 0 ? (
        <div className="text-center py-12 bg-white/10 rounded-lg backdrop-blur-sm">
          <ShoppingBag className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <p className="text-white text-lg">
            No items in your wishlist yet. Add something you want to buy! 🛒
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {purchases.map((purchase) => {
            const affordable = canAfford(purchase.cost)
            return (
              <div
                key={purchase.id}
                className={`bg-white rounded-lg p-6 shadow-lg transition-all hover:scale-105 ${
                  purchase.purchased
                    ? 'opacity-75 border-2 border-green-500'
                    : affordable
                    ? 'border-2 border-green-300'
                    : 'border-2 border-gray-300 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-xl ${
                        purchase.purchased
                          ? 'line-through text-gray-500'
                          : 'text-gray-800'
                      }`}
                    >
                      {purchase.name}
                    </h3>
                    {purchase.description && (
                      <p className="text-gray-600 text-sm mt-2">
                        {purchase.description}
                      </p>
                    )}
                  </div>
                  {purchase.purchased && (
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 ml-2" />
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-600" />
                    <span
                      className={`text-xl font-bold ${
                        purchase.purchased
                          ? 'text-gray-400'
                          : affordable
                          ? 'text-green-600'
                          : 'text-red-500'
                      }`}
                    >
                      {purchase.cost.toLocaleString()} 🪙
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {!purchase.purchased && (
                      <button
                        onClick={() => buyPurchase(purchase.id)}
                        disabled={!affordable}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          affordable
                            ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Buy
                      </button>
                    )}
                    <button
                      onClick={() => deletePurchase(purchase.id)}
                      className="text-red-400 hover:text-red-600 transition-all hover:scale-110 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {purchase.purchased && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-green-600 text-sm font-semibold">
                      ✓ Purchased! Enjoy your reward! 🎉
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-4 border border-blue-300/30">
        <p className="text-white text-sm">
          💡 <strong>Tip:</strong> Complete quests to earn coins, then use them
          to buy real-life items from your wishlist! This makes completing tasks
          more rewarding and fun.
        </p>
      </div>
    </div>
  )
}

