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
      totalQuestsCompleted: 0, // Total quests completed (all time)
      totalDailyQuestsCompleted: 0, // Total daily quests completed (all time)
      totalWeeklyQuestsCompleted: 0, // Total weekly quests completed (all time)
      totalMonthlyQuestsCompleted: 0, // Total monthly quests completed (all time)
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
          let completedDays = [...state.completedDays]
          if (type === 'daily' && allDailyCompleted) {
            const lastLevelUp = lastDailyLevelUpDate
              ? new Date(lastDailyLevelUpDate).toDateString()
              : null
            // Always update the completion timestamp to show exact completion time
            lastDailyLevelUpDate = new Date().toISOString()
            if (lastLevelUp !== today) {
              newDailyLevel = state.dailyLevel + 1
              
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

          // Increment total quest completion counters
          const newTotalQuestsCompleted = state.totalQuestsCompleted + 1
          const newTotalDailyQuestsCompleted = type === 'daily' ? state.totalDailyQuestsCompleted + 1 : state.totalDailyQuestsCompleted
          const newTotalWeeklyQuestsCompleted = type === 'weekly' ? state.totalWeeklyQuestsCompleted + 1 : state.totalWeeklyQuestsCompleted
          const newTotalMonthlyQuestsCompleted = type === 'monthly' ? state.totalMonthlyQuestsCompleted + 1 : state.totalMonthlyQuestsCompleted

          return {
            quests: {
              ...state.quests,
              [type]: updatedQuests,
            },
            xp: newXP,
            totalXP: newTotalXP,
            coins: newCoins,
            totalEarned: newTotalEarned,
            totalQuestsCompleted: newTotalQuestsCompleted,
            totalDailyQuestsCompleted: newTotalDailyQuestsCompleted,
            totalWeeklyQuestsCompleted: newTotalWeeklyQuestsCompleted,
            totalMonthlyQuestsCompleted: newTotalMonthlyQuestsCompleted,
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
        set((state) => {
          const quest = state.quests[type].find((q) => q.id === questId)
          if (!quest) return state

          // Calculate the new values after updates
          const newTargetAmount = updates.targetAmount !== undefined ? updates.targetAmount : quest.targetAmount
          const newCurrentAmount = updates.currentAmount !== undefined ? updates.currentAmount : (quest.currentAmount || 0)
          
          // Prepare the updated quest
          const updatedQuest = {
            ...quest,
            ...updates,
          }

          // If quest has a target amount, check if it should be marked as incomplete
          if (newTargetAmount !== null && newTargetAmount !== undefined) {
            // If current amount is less than target, mark as incomplete
            if (newCurrentAmount < newTargetAmount) {
              updatedQuest.completed = false
              updatedQuest.completedAt = null
            }
          }

          return {
            quests: {
              ...state.quests,
              [type]: state.quests[type].map((q) =>
                q.id === questId ? updatedQuest : q
              ),
            },
          }
        })
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
          let shouldReset = false
          
          if (!state.lastDailyResetDate) {
            // No previous reset date, should reset
            shouldReset = true
          } else {
            try {
              // Try to parse the stored date (handles ISO strings, timestamps, or date strings)
              const lastResetDate = new Date(state.lastDailyResetDate)
              if (isNaN(lastResetDate.getTime())) {
                // Invalid date, should reset
                shouldReset = true
              } else {
                // Use local time for comparison to avoid timezone issues
                const resetYear = lastResetDate.getFullYear()
                const resetMonth = String(lastResetDate.getMonth() + 1).padStart(2, '0')
                const resetDay = String(lastResetDate.getDate()).padStart(2, '0')
                lastReset = `${resetYear}-${resetMonth}-${resetDay}`
                
                // Compare dates - reset if it's a different day
                shouldReset = lastReset !== today
              }
            } catch (e) {
              // If parsing fails, treat as new day (will reset)
              console.warn('Error parsing lastDailyResetDate:', e)
              shouldReset = true
            }
          }

          // Only reset if it's a new day (or if lastReset is null/invalid)
          if (shouldReset) {
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
          const now = new Date()
          const thisWeek = getWeekNumber(now)
          const thisYear = now.getFullYear()
          
          let shouldReset = false
          
          if (!state.lastWeeklyResetDate) {
            // No previous reset date, should reset
            shouldReset = true
          } else {
            try {
              const lastResetDate = new Date(state.lastWeeklyResetDate)
              if (isNaN(lastResetDate.getTime())) {
                // Invalid date, should reset
                shouldReset = true
              } else {
                const lastResetWeek = getWeekNumber(lastResetDate)
                const lastResetYear = lastResetDate.getFullYear()
                
                // Only reset if it's a new week (or new year)
                shouldReset = lastResetWeek !== thisWeek || lastResetYear !== thisYear
              }
            } catch (e) {
              // If parsing fails, treat as new week (will reset)
              console.warn('Error parsing lastWeeklyResetDate:', e)
              shouldReset = true
            }
          }

          if (shouldReset) {
            console.log('🔄 Resetting weekly quests:', { thisWeek, thisYear, now: now.toLocaleString() })
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
              lastWeeklyResetDate: now.toISOString(),
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
          
          let shouldReset = false
          
          if (!state.lastMonthlyResetDate) {
            // No previous reset date, should reset
            shouldReset = true
          } else {
            try {
              const lastReset = new Date(state.lastMonthlyResetDate)
              if (isNaN(lastReset.getTime())) {
                // Invalid date, should reset
                shouldReset = true
              } else {
                const lastResetMonth = lastReset.getMonth()
                const lastResetYear = lastReset.getFullYear()
                
                // Only reset if it's a new month (or new year)
                shouldReset = lastResetMonth !== thisMonth || lastResetYear !== thisYear
              }
            } catch (e) {
              // If parsing fails, treat as new month (will reset)
              console.warn('Error parsing lastMonthlyResetDate:', e)
              shouldReset = true
            }
          }

          if (shouldReset) {
            console.log('🔄 Resetting monthly quests:', { thisMonth: thisMonth + 1, thisYear, now: now.toLocaleString() })
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
              lastMonthlyResetDate: now.toISOString(),
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
              // Always update the completion timestamp to show exact completion time
              lastDailyLevelUpDate = new Date().toISOString()
              if (lastLevelUp !== today) {
                newDailyLevel = state.dailyLevel + 1
                
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

            // Increment total quest completion counters
            const newTotalQuestsCompleted = state.totalQuestsCompleted + 1
            const newTotalDailyQuestsCompleted = type === 'daily' ? state.totalDailyQuestsCompleted + 1 : state.totalDailyQuestsCompleted
            const newTotalWeeklyQuestsCompleted = type === 'weekly' ? state.totalWeeklyQuestsCompleted + 1 : state.totalWeeklyQuestsCompleted
            const newTotalMonthlyQuestsCompleted = type === 'monthly' ? state.totalMonthlyQuestsCompleted + 1 : state.totalMonthlyQuestsCompleted

            return {
              quests: {
                ...state.quests,
                [type]: updatedQuests,
              },
              xp: newXP,
              totalXP: newTotalXP,
              coins: newCoins,
              totalEarned: newTotalEarned,
              totalQuestsCompleted: newTotalQuestsCompleted,
              totalDailyQuestsCompleted: newTotalDailyQuestsCompleted,
              totalWeeklyQuestsCompleted: newTotalWeeklyQuestsCompleted,
              totalMonthlyQuestsCompleted: newTotalMonthlyQuestsCompleted,
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

      // Check if quests need to be refreshed (for 1:00 AM safety check)
      checkQuestsNeedRefresh: () => {
        const state = get()
        const now = new Date()
        
        // Check daily quests
        let dailyNeedsRefresh = false
        if (!state.lastDailyResetDate) {
          dailyNeedsRefresh = true
        } else {
          try {
            const lastResetDate = new Date(state.lastDailyResetDate)
            if (isNaN(lastResetDate.getTime())) {
              dailyNeedsRefresh = true
            } else {
              const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
              const lastReset = `${lastResetDate.getFullYear()}-${String(lastResetDate.getMonth() + 1).padStart(2, '0')}-${String(lastResetDate.getDate()).padStart(2, '0')}`
              dailyNeedsRefresh = lastReset !== today
            }
          } catch (e) {
            dailyNeedsRefresh = true
          }
        }

        // Check weekly quests
        let weeklyNeedsRefresh = false
        if (!state.lastWeeklyResetDate) {
          weeklyNeedsRefresh = true
        } else {
          try {
            const lastResetDate = new Date(state.lastWeeklyResetDate)
            if (isNaN(lastResetDate.getTime())) {
              weeklyNeedsRefresh = true
            } else {
              const thisWeek = getWeekNumber(now)
              const thisYear = now.getFullYear()
              const lastResetWeek = getWeekNumber(lastResetDate)
              const lastResetYear = lastResetDate.getFullYear()
              weeklyNeedsRefresh = lastResetWeek !== thisWeek || lastResetYear !== thisYear
            }
          } catch (e) {
            weeklyNeedsRefresh = true
          }
        }

        // Check monthly quests
        let monthlyNeedsRefresh = false
        if (!state.lastMonthlyResetDate) {
          monthlyNeedsRefresh = true
        } else {
          try {
            const lastResetDate = new Date(state.lastMonthlyResetDate)
            if (isNaN(lastResetDate.getTime())) {
              monthlyNeedsRefresh = true
            } else {
              const thisMonth = now.getMonth()
              const thisYear = now.getFullYear()
              const lastResetMonth = lastResetDate.getMonth()
              const lastResetYear = lastResetDate.getFullYear()
              monthlyNeedsRefresh = lastResetMonth !== thisMonth || lastResetYear !== thisYear
            }
          } catch (e) {
            monthlyNeedsRefresh = true
          }
        }

        return dailyNeedsRefresh || weeklyNeedsRefresh || monthlyNeedsRefresh
      },
    }),
    {
      name: 'life-todos-storage',
    }
  )
)

