import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Quest types and their base rewards
const QUEST_REWARDS = {
  daily: { xp: 10, coins: 5 },
  weekly: { xp: 50, coins: 25 },
  monthly: { xp: 200, coins: 100 },
}

// Get week number of the year
const getWeekNumber = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

export const useStore = create(
  persist(
    (set, get) => ({
      // Player stats
      dailyLevel: 1,
      weeklyLevel: 1,
      xp: 0,
      totalXP: 0,
      coins: 0,
      totalEarned: 0, // Total coins earned (for tracking)
      lastDailyLevelUpDate: null, // Track when user last leveled up daily
      lastWeeklyLevelUpDate: null, // Track when user last leveled up weekly
      lastDailyResetDate: null, // Track when daily quests were last reset
      lastWeeklyResetDate: null, // Track when weekly quests were last reset
      lastMonthlyResetDate: null, // Track when monthly quests were last reset
      completedDays: [], // Track dates when all daily quests were completed (format: "YYYY-MM-DD")
      completedWeeks: [], // Track week numbers when all weekly quests were completed (format: "YYYY-WW")

      // Quests
      quests: {
        daily: [],
        weekly: [],
        monthly: [],
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
          trackingType: quest.trackingType || 'unit',
          targetAmount: quest.targetAmount || null,
          currentAmount: 0, // Track progress
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

          // Check if all daily quests are completed for daily level up
          const today = new Date().toDateString()
          let newDailyLevel = state.dailyLevel
          let lastDailyLevelUpDate = state.lastDailyLevelUpDate
          const allDailyCompleted = 
            type === 'daily' &&
            state.quests.daily.length > 0 && 
            state.quests.daily.every((q) => {
              if (q.id === questId) return true // This quest is now completed
              return q.completed === true
            })

          // Daily level up if all daily quests are completed and haven't leveled up today
          if (type === 'daily' && allDailyCompleted) {
            const lastLevelUp = lastDailyLevelUpDate
              ? new Date(lastDailyLevelUpDate).toDateString()
              : null
            if (lastLevelUp !== today) {
              newDailyLevel = state.dailyLevel + 1
              lastDailyLevelUpDate = today
            }
          }

          // Check if all weekly quests are completed for weekly level up
          let newWeeklyLevel = state.weeklyLevel
          let lastWeeklyLevelUpDate = state.lastWeeklyLevelUpDate
          const allWeeklyCompleted = 
            type === 'weekly' &&
            state.quests.weekly.length > 0 && 
            state.quests.weekly.every((q) => {
              if (q.id === questId) return true // This quest is now completed
              return q.completed === true
            })

          // Weekly level up if all weekly quests are completed
          let completedWeeks = [...state.completedWeeks]
          if (type === 'weekly' && allWeeklyCompleted) {
            const thisWeek = getWeekNumber(new Date())
            const lastLevelUpWeek = lastWeeklyLevelUpDate
              ? getWeekNumber(new Date(lastWeeklyLevelUpDate))
              : null
            if (lastLevelUpWeek !== thisWeek) {
              newWeeklyLevel = state.weeklyLevel + 1
              lastWeeklyLevelUpDate = new Date().toISOString()
              
              // Track completed week (format: YYYY-WW)
              const now = new Date()
              const weekStr = `${now.getFullYear()}-${String(thisWeek).padStart(2, '0')}`
              if (!completedWeeks.includes(weekStr)) {
                completedWeeks.push(weekStr)
              }
            }
          }

          return {
            quests: {
              ...state.quests,
              [type]: updatedQuests,
            },
            xp: newXP,
            totalXP: newTotalXP,
            coins: newCoins,
            totalEarned: newTotalEarned,
            dailyLevel: newDailyLevel,
            weeklyLevel: newWeeklyLevel,
            lastDailyLevelUpDate: lastDailyLevelUpDate,
            lastWeeklyLevelUpDate: lastWeeklyLevelUpDate,
            completedDays: completedDays,
            completedWeeks: completedWeeks,
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

      updateQuest: (type, questId, updates) => {
        set((state) => ({
          quests: {
            ...state.quests,
            [type]: state.quests[type].map((q) =>
              q.id === questId
                ? {
                    ...q,
                    ...updates,
                  }
                : q
            ),
          },
        }))
      },

      resetDailyQuests: () => {
        set((state) => {
          const now = new Date()
          // Get date in YYYY-MM-DD format using local time (not UTC)
          const year = now.getFullYear()
          const month = String(now.getMonth() + 1).padStart(2, '0')
          const day = String(now.getDate()).padStart(2, '0')
          const today = `${year}-${month}-${day}`
          
          let lastReset = null
          if (state.lastDailyResetDate) {
            try {
              // Try to parse the stored date (handles ISO strings, timestamps, or date strings)
              const lastResetDate = new Date(state.lastDailyResetDate)
              if (!isNaN(lastResetDate.getTime())) {
                // Use local time for comparison
                const resetYear = lastResetDate.getFullYear()
                const resetMonth = String(lastResetDate.getMonth() + 1).padStart(2, '0')
                const resetDay = String(lastResetDate.getDate()).padStart(2, '0')
                lastReset = `${resetYear}-${resetMonth}-${resetDay}`
              }
            } catch (e) {
              // If parsing fails, treat as new day (will reset)
              lastReset = null
            }
          }

          // Only reset if it's a new day (or if lastReset is null/invalid)
          if (lastReset !== today) {
            console.log('🔄 Resetting daily quests:', { lastReset, today, now: now.toLocaleString() })
            return {
              quests: {
                ...state.quests,
                daily: state.quests.daily.map((q) => ({
                  ...q,
                  completed: false,
                  currentAmount: 0,
                  completedAt: null,
                })),
              },
              lastDailyResetDate: now.toISOString(),
            }
          }
          return state
        })
      },


      resetWeeklyQuests: () => {
        set((state) => {
          const thisWeek = getWeekNumber(new Date())
          const thisYear = new Date().getFullYear()
          const lastResetWeek = state.lastWeeklyResetDate
            ? getWeekNumber(new Date(state.lastWeeklyResetDate))
            : null
          const lastResetYear = state.lastWeeklyResetDate
            ? new Date(state.lastWeeklyResetDate).getFullYear()
            : null

          // Only reset if it's a new week (or new year)
          if (lastResetWeek !== thisWeek || lastResetYear !== thisYear) {
            return {
              quests: {
                ...state.quests,
                weekly: state.quests.weekly.map((q) => ({
                  ...q,
                  completed: false,
                  currentAmount: 0,
                  completedAt: null,
                })),
              },
              lastWeeklyResetDate: new Date().toISOString(),
            }
          }
          return state
        })
      },

      resetMonthlyQuests: () => {
        set((state) => {
          const now = new Date()
          const thisMonth = now.getMonth()
          const thisYear = now.getFullYear()
          const lastReset = state.lastMonthlyResetDate
            ? new Date(state.lastMonthlyResetDate)
            : null
          const lastResetMonth = lastReset ? lastReset.getMonth() : null
          const lastResetYear = lastReset ? lastReset.getFullYear() : null

          // Only reset if it's a new month (or new year)
          if (lastResetMonth !== thisMonth || lastResetYear !== thisYear) {
            return {
              quests: {
                ...state.quests,
                monthly: state.quests.monthly.map((q) => ({
                  ...q,
                  completed: false,
                  currentAmount: 0,
                  completedAt: null,
                })),
              },
              lastMonthlyResetDate: new Date().toISOString(),
            }
          }
          return state
        })
      },

      updateQuestProgress: (type, questId, amount) => {
        set((state) => {
          const quest = state.quests[type].find((q) => q.id === questId)
          if (!quest || quest.completed) return state

          const newCurrentAmount = (quest.currentAmount || 0) + amount
          const isCompleted = newCurrentAmount >= (quest.targetAmount || 0)

          // If completed, trigger completion logic
          if (isCompleted && !quest.completed) {
            const reward = quest.reward
            const newXP = state.xp + reward.xp
            const newTotalXP = state.totalXP + reward.xp
            const newCoins = state.coins + reward.coins
            const newTotalEarned = state.totalEarned + reward.coins

            // Update quests
            const updatedQuests = state.quests[type].map((q) =>
              q.id === questId
                ? {
                    ...q,
                    currentAmount: newCurrentAmount,
                    completed: true,
                    completedAt: new Date().toISOString(),
                  }
                : q
            )

            // Check if all daily quests are completed for daily level up
            const today = new Date().toDateString()
            let newDailyLevel = state.dailyLevel
            let lastDailyLevelUpDate = state.lastDailyLevelUpDate
            const allDailyCompleted = 
              type === 'daily' &&
              state.quests.daily.length > 0 && 
              updatedQuests.every((q) => q.completed === true)

            // Daily level up if all daily quests are completed and haven't leveled up today
            let completedDays = [...state.completedDays]
            if (allDailyCompleted) {
              const lastLevelUp = lastDailyLevelUpDate
                ? new Date(lastDailyLevelUpDate).toDateString()
                : null
              if (lastLevelUp !== today) {
                newDailyLevel = state.dailyLevel + 1
                lastDailyLevelUpDate = today
                
                // Track completed day (format: YYYY-MM-DD)
                const todayStr = new Date().toISOString().split('T')[0]
                if (!completedDays.includes(todayStr)) {
                  completedDays.push(todayStr)
                }
              }
            }

            // Check if all weekly quests are completed for weekly level up
            let newWeeklyLevel = state.weeklyLevel
            let lastWeeklyLevelUpDate = state.lastWeeklyLevelUpDate
            const allWeeklyCompleted = 
              type === 'weekly' &&
              state.quests.weekly.length > 0 && 
              updatedQuests.every((q) => q.completed === true)

            // Weekly level up if all weekly quests are completed
            let completedWeeks = [...state.completedWeeks]
            if (allWeeklyCompleted) {
              const thisWeek = getWeekNumber(new Date())
              const lastLevelUpWeek = lastWeeklyLevelUpDate
                ? getWeekNumber(new Date(lastWeeklyLevelUpDate))
                : null
              if (lastLevelUpWeek !== thisWeek) {
                newWeeklyLevel = state.weeklyLevel + 1
                lastWeeklyLevelUpDate = new Date().toISOString()
                
                // Track completed week (format: YYYY-WW)
                const now = new Date()
                const weekStr = `${now.getFullYear()}-${String(thisWeek).padStart(2, '0')}`
                if (!completedWeeks.includes(weekStr)) {
                  completedWeeks.push(weekStr)
                }
              }
            }

            return {
              quests: {
                ...state.quests,
                [type]: updatedQuests,
              },
              xp: newXP,
              totalXP: newTotalXP,
              coins: newCoins,
              totalEarned: newTotalEarned,
            dailyLevel: newDailyLevel,
            weeklyLevel: newWeeklyLevel,
            lastDailyLevelUpDate: lastDailyLevelUpDate,
            lastWeeklyLevelUpDate: lastWeeklyLevelUpDate,
            completedDays: completedDays,
            completedWeeks: completedWeeks,
            }
          }

          // Just update progress
          return {
            quests: {
              ...state.quests,
              [type]: state.quests[type].map((q) =>
                q.id === questId
                  ? {
                      ...q,
                      currentAmount: newCurrentAmount,
                    }
                  : q
              ),
            },
          }
        })
      },

      addPurchase: (purchase) => {
        set((state) => {
          const costNum = purchase.cost
          // Check if user has enough coins
          if (state.coins < costNum) {
            // Return state unchanged if not enough coins (will show error in UI)
            return state
          }

          const newPurchase = {
            id: Date.now().toString(),
            name: purchase.name,
            cost: costNum,
            realCost: purchase.realCost || null,
            description: purchase.description || '',
            purchased: true, // Mark as purchased immediately
            purchasedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }

          return {
            coins: state.coins - costNum, // Deduct coins immediately
            purchases: [...state.purchases, newPurchase],
          }
        })
      },

      // Keep buyPurchase for backward compatibility, but it's no longer used
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

