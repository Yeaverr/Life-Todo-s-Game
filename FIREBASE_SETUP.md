# Firebase Setup Instructions

Follow these steps to set up Firebase for your Life ToDos Game app.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `life-todos-game` (or your preferred name)
4. Disable Google Analytics (optional, you can enable later)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Select "Start in test mode" (for now)
4. Choose a location (closest to you)
5. Click "Enable"

## Step 3: Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ > **Project settings**
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Register app name (e.g., "Life ToDos Game")
5. Copy the `firebaseConfig` object

## Step 4: Update Firebase Config

1. Open `src/firebase/config.js`
2. Replace the placeholder values with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

## Step 5: Install Firebase CLI (for hosting)

1. Install Firebase CLI globally:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```

4. Select:
   - ✅ Firestore
   - ✅ Hosting
   - Use existing project (select your project)
   - Use default file names
   - Public directory: `dist`
   - Single-page app: Yes
   - Overwrite index.html: No

5. Update `.firebaserc` with your project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Step 6: Deploy to Firebase Hosting

1. Build your app:
```bash
npm run build
```

2. Deploy:
```bash
npm run deploy
```

Or use:
```bash
firebase deploy --only hosting
```

## Step 7: Access Your App

After deployment, you'll get a URL like:
`https://your-project-id.web.app`

## Security Rules (Important!)

Update Firestore rules for production in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Allow read/write for authenticated users only
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Then deploy rules:
```bash
firebase deploy --only firestore:rules
```

## Current Setup

- ✅ Firebase Firestore for data storage
- ✅ Real-time sync across devices
- ✅ Firebase Hosting for web deployment
- ✅ localStorage as fallback (works offline)

## Notes

- Data syncs automatically across all devices
- Changes save to Firebase with 2-second debounce
- localStorage still works as backup
- Free tier should be enough for personal use

## Troubleshooting

If you see Firebase errors:
1. Check that `src/firebase/config.js` has correct values
2. Make sure Firestore is enabled in Firebase Console
3. Check browser console for specific error messages

