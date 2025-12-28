import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { loadFromFirebase, saveToFirebase, subscribeToFirebase } from '../firebase/storeSync'

// Hook to sync Zustand store with Firebase
export const useFirebaseSync = () => {
  const store = useStore()
  const isInitializing = useRef(true)
  const lastSavedState = useRef(null)
  const saveTimeoutRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    let unsubscribe = null

    // Load initial data from Firebase
    const initializeFirebase = async () => {
      try {
        const savedState = await loadFromFirebase()
        if (savedState && isMounted) {
          // Store the loaded state as the last saved state
          lastSavedState.current = JSON.stringify(savedState)
          // Merge Firebase data with current store state
          useStore.setState(savedState)
        }
        
        // Mark initialization as complete
        isInitializing.current = false

        // Subscribe to real-time updates
        unsubscribe = subscribeToFirebase((updatedState) => {
          if (isMounted && !isInitializing.current) {
            // Update last saved state when receiving from Firebase
            lastSavedState.current = JSON.stringify(updatedState)
            useStore.setState(updatedState)
          }
        })
      } catch (error) {
        console.error('Firebase sync error:', error)
        isInitializing.current = false
      }
    }

    initializeFirebase()

    // Save to Firebase whenever store changes (debounced and only if changed)
    const unsubscribeStore = useStore.subscribe(
      (state) => {
        // Don't save during initialization or if loading from Firebase
        if (isInitializing.current) {
          return
        }

        // Filter out functions for comparison
        const serializableState = {
          dailyLevel: state.dailyLevel,
          weeklyLevel: state.weeklyLevel,
          coins: state.coins,
          quests: state.quests,
          purchases: state.purchases,
          completedDays: state.completedDays,
          completedWeeks: state.completedWeeks,
          lastDailyResetDate: state.lastDailyResetDate,
          lastWeeklyResetDate: state.lastWeeklyResetDate,
          lastMonthlyResetDate: state.lastMonthlyResetDate,
        }
        
        const currentStateStr = JSON.stringify(serializableState)
        
        // Only save if state actually changed
        if (currentStateStr === lastSavedState.current) {
          return
        }

        // Clear existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current)
        }

        // Debounce saves to avoid too many writes
        saveTimeoutRef.current = setTimeout(() => {
          if (isMounted && !isInitializing.current) {
            saveToFirebase(state).then(() => {
              // Update last saved state after successful save
              lastSavedState.current = currentStateStr
            })
          }
        }, 3000) // Save 3 seconds after last change
      }
    )

    return () => {
      isMounted = false
      if (unsubscribe) unsubscribe()
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      unsubscribeStore()
    }
  }, [])
}

