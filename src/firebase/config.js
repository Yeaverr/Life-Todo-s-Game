import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
// You'll need to replace these with your actual Firebase config values
// Get these from Firebase Console > Project Settings > Your apps
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBj0FJjT95Eo8xBnq9Jd2_Rz0Sf11UoaZE",
  authDomain: "reallifetodosgame.firebaseapp.com",
  projectId: "reallifetodosgame",
  storageBucket: "reallifetodosgame.firebasestorage.app",
  messagingSenderId: "96407020014",
  appId: "1:96407020014:web:447966dfd23f96bc51eeff"
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "AIzaSyBj0FJjT95Eo8xBnq9Jd2_Rz0Sf11UoaZE"

// Initialize Firebase only if configured
let app = null
let db = null
let auth = null

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } catch (error) {
    console.error('Firebase initialization error:', error)
  }
} else {
  console.warn('Firebase not configured yet. App will use localStorage only.')
}

export { db, auth }
export default app

