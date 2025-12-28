import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { loadFromFirebase, saveToFirebase, subscribeToFirebase } from '../firebase/storeSync'

// Hook to sync Zustand store with Firebase
export const useFirebaseSync = () => {
  const store = useStore()

  useEffect(() => {
    let isMounted = true
    let unsubscribe = null

    // Load initial data from Firebase
    const initializeFirebase = async () => {
      try {
        const savedState = await loadFromFirebase()
        if (savedState && isMounted) {
          // Merge Firebase data with current store state
          useStore.setState(savedState)
        }

        // Subscribe to real-time updates
        unsubscribe = subscribeToFirebase((updatedState) => {
          if (isMounted) {
            useStore.setState(updatedState)
          }
        })
      } catch (error) {
        console.error('Firebase sync error:', error)
      }
    }

    initializeFirebase()

    // Save to Firebase whenever store changes (debounced)
    let saveTimeout = null
    const unsubscribeStore = useStore.subscribe(
      (state) => {
        // Debounce saves to avoid too many writes
        if (saveTimeout) {
          clearTimeout(saveTimeout)
        }
        saveTimeout = setTimeout(() => {
          saveToFirebase(state)
        }, 2000) // Save 2 seconds after last change
      }
    )

    return () => {
      isMounted = false
      if (unsubscribe) unsubscribe()
      if (saveTimeout) clearTimeout(saveTimeout)
      unsubscribeStore()
    }
  }, [])
}

