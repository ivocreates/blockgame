# Firebase Setup Guide

## Firebase Realtime Database Rules

Your Firebase database currently has permission denied errors. You need to update the database rules to allow access.

### Steps to Fix:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **blkchngaw3**
3. Click on **Realtime Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with one of the options below:

### Option 1: Open Access (For Development/Testing)
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
⚠️ **Warning**: This allows anyone to read/write. Use only for development.

### Option 2: Authenticated Access (Recommended for Production)
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
Note: This requires users to be authenticated. You'll need to implement Firebase Authentication.

### Option 3: Structured Rules (Best for This App)
```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": true,
        ".write": true
      }
    },
    "miners": {
      "$userId": {
        ".read": true,
        ".write": true
      }
    },
    "blockchain": {
      ".read": true,
      ".write": true
    }
  }
}
```
This allows read/write for specific data structures used by the app.

### Recommended: Start with Option 3

After pasting the rules, click **Publish** to save the changes.

## Verify the Fix

1. Refresh your app at http://localhost:8000
2. Try creating a profile
3. Check the browser console - permission errors should be gone
4. The leaderboard should load properly

## Security Note

For production deployment, consider:
- Implementing Firebase Authentication
- Adding rate limiting
- Validating data structure
- Adding user-specific write rules

Example production rules:
```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": true,
        ".write": "$userId === newData.child('userId').val()"
      }
    },
    "miners": {
      "$userId": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['userId', 'name', 'grade', 'blocksMined'])"
      }
    }
  }
}
```
