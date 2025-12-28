import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from './config'
import { auth } from './config'

// Get user ID (for now, using localStorage to store a user ID)
// In the future, you can add proper authentication
const getUserId = () => {
  // Use localStorage to store a user ID (persists across sessions)
  // Later, you can use: auth.currentUser?.uid || 'anonymous'
  if (typeof window !== 'undefined') {
    let userId = localStorage.getItem('firebase-user-id')
    if (!userId) {
      userId = `user-${Date.now()}`
      localStorage.setItem('firebase-user-id', userId)
    }
    return userId
  }
  return 'user-1'
}

// Load data from Firestore
export const loadFromFirebase = async () => {
  if (!db) {
    // Firebase not configured, return null (will use localStorage)
    return null
  }
  try {
    const userId = getUserId()
    const userDocRef = doc(db, 'users', userId)
    const docSnap = await getDoc(userDocRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      delete data.lastUpdated // Remove metadata
      return data
    }
    return null
  } catch (error) {
    console.error('Error loading from Firebase:', error)
    return null
  }
}

// Save data to Firestore
export const saveToFirebase = async (data) => {
  if (!db) {
    // Firebase not configured, skip save (will use localStorage)
    return false
  }
  try {
    const userId = getUserId()
    const userDocRef = doc(db, 'users', userId)
    await setDoc(userDocRef, {
      ...data,
      lastUpdated: new Date().toISOString(),
    }, { merge: true })
    return true
  } catch (error) {
    console.error('Error saving to Firebase:', error)
    return false
  }
}

// Subscribe to real-time updates
export const subscribeToFirebase = (callback) => {
  if (!db) {
    // Firebase not configured, return empty unsubscribe function
    return () => {}
  }
  try {
    const userId = getUserId()
    const userDocRef = doc(db, 'users', userId)
    
    return onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        delete data.lastUpdated // Remove metadata
        callback(data)
      }
    }, (error) => {
      console.error('Error in Firebase subscription:', error)
    })
  } catch (error) {
    console.error('Error setting up Firebase subscription:', error)
    return () => {} // Return empty unsubscribe function
  }
}

