import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Quest types and their base rewards
const QUEST_REWARDS = {
  daily: { xp: 10, coins: 5 },
  weekly: { xp: 50, coins: 25 },
  monthly: { xp: 200, coins: 100 },
  yearly: { xp: 1000, coins: 500 },
}

// XP required for each level (exponential growth)
const getXPForLevel = (level) => {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

export const useStore = create(
  persist(
    (set, get) => ({
      // Player stats
      level: 1,
      xp: 0,
      totalXP: 0,
      coins: 0,
      totalEarned: 0, // Total coins earned (for tracking)
      dailyStreak: 0,
      lastCompletedDate: null,

      // Quests
      quests: {
        daily: [],
        weekly: [],
        monthly: [],
        yearly: [],
      },

      // Achievements
      achievements: [],

      // Purchases (real-life items to buy)
      purchases: [],

      // Actions
      addQuest: (type, quest) => {
        const newQuest = {
          id: Date.now().toString(),
          title: quest.title,
          description: quest.description || '',
          completed: false,
          createdAt: new Date().toISOString(),
          completedAt: null,
          reward: QUEST_REWARDS[type],
        }
        set((state) => ({
          quests: {
            ...state.quests,
            [type]: [...state.quests[type], newQuest],
          },
        }))
      },

      completeQuest: (type, questId) => {
        set((state) => {
          const quest = state.quests[type].find((q) => q.id === questId)
          if (!quest || quest.completed) return state

          const reward = quest.reward
          const newXP = state.xp + reward.xp
          const newTotalXP = state.totalXP + reward.xp
          const newCoins = state.coins + reward.coins
          const newTotalEarned = state.totalEarned + reward.coins

          // Calculate new level
          let newLevel = state.level
          let currentXP = newXP
          while (currentXP >= getXPForLevel(newLevel + 1)) {
            newLevel++
            currentXP -= getXPForLevel(newLevel)
          }

          // Update daily streak
          const today = new Date().toDateString()
          const lastDate = state.lastCompletedDate
            ? new Date(state.lastCompletedDate).toDateString()
            : null
          let newStreak = state.dailyStreak
          if (type === 'daily') {
            if (lastDate === today) {
              // Already completed today
            } else if (
              lastDate === new Date(Date.now() - 86400000).toDateString()
            ) {
              // Consecutive day
              newStreak += 1
            } else if (lastDate !== today) {
              // New streak
              newStreak = 1
            }
          }

          // Update quest
          const updatedQuests = state.quests[type].map((q) =>
            q.id === questId
              ? {
                  ...q,
                  completed: true,
                  completedAt: new Date().toISOString(),
                }
              : q
          )

          return {
            quests: {
              ...state.quests,
              [type]: updatedQuests,
            },
            xp: currentXP,
            totalXP: newTotalXP,
            coins: newCoins,
            totalEarned: newTotalEarned,
            level: newLevel,
            dailyStreak: newStreak,
            lastCompletedDate: today,
          }
        })
      },

      deleteQuest: (type, questId) => {
        set((state) => ({
          quests: {
            ...state.quests,
            [type]: state.quests[type].filter((q) => q.id !== questId),
          },
        }))
      },

      addPurchase: (purchase) => {
        const newPurchase = {
          id: Date.now().toString(),
          name: purchase.name,
          cost: purchase.cost,
          description: purchase.description || '',
          purchased: false,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          purchases: [...state.purchases, newPurchase],
        }))
      },

      buyPurchase: (purchaseId) => {
        set((state) => {
          const purchase = state.purchases.find((p) => p.id === purchaseId)
          if (!purchase || purchase.purchased || state.coins < purchase.cost) {
            return state
          }

          return {
            coins: state.coins - purchase.cost,
            purchases: state.purchases.map((p) =>
              p.id === purchaseId ? { ...p, purchased: true } : p
            ),
          }
        })
      },

      deletePurchase: (purchaseId) => {
        set((state) => ({
          purchases: state.purchases.filter((p) => p.id !== purchaseId),
        }))
      },
    }),
    {
      name: 'life-todos-storage',
    }
  )
)

