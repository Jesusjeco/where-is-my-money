# Firestore Database Setup Guide

## ✅ Setup Complete!

The Firestore database has been successfully configured with the required indexes and security rules. Your expense tracking application is now fully functional with cloud storage.

## 1. Create Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `where-is-my-money-30701`
3. Navigate to **Firestore Database** → **Rules**
4. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own expenses
    match /expenses/{expenseId} {
      allow read, write, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
  }
}
```

5. Click **Publish** to save the rules

## 2. Create Required Composite Indexes

The application uses compound queries that require composite indexes. You have two options:

### Option A: Auto-create via Error Links (Recommended)

1. **For getAllExpenses() query:**
   - Click this link from your console error: 
   ```
   https://console.firebase.google.com/v1/r/project/where-is-my-money-30701/firestore/indexes?create_composite=ClNwcm9qZWN0cy93aGVyZS1pcy1teS1tb25leS0zMDcwMS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvZXhwZW5zZXMvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaDQoEZGF0ZRAB
   ```
   - This creates an index for: `userId (Ascending)` + `date (Descending)`

2. **For getExpensesByDateRange() query:**
   - Click this link from your console error:
   ```
   https://console.firebase.google.com/v1/r/project/where-is-my-money-30701/firestore/indexes?create_composite=ClNwcm9qZWN0cy93aGVyZS1pcy1teS1tb25leS0zMDcwMS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvZXhwZW5zZXMvaW5kZXhlcy9fEAEaCgoGdXNlcklkEAEaCAoEZGF0ZRABGggKBGRhdGUQAQ
   ```
   - This creates an index for: `userId (Ascending)` + `date (Ascending)` + `date (Ascending)`

### Option B: Manual Creation

1. Go to **Firestore Database** → **Indexes** → **Composite**
2. Click **Create Index**
3. Create the following indexes:

**Index 1: For getAllExpenses()**
- Collection ID: `expenses`
- Fields:
  - `userId` - Ascending
  - `date` - Descending
- Query scope: Collection

**Index 2: For getExpensesByDateRange()**
- Collection ID: `expenses`
- Fields:
  - `userId` - Ascending
  - `date` - Ascending
- Query scope: Collection

## 3. Wait for Index Creation

- Indexes can take several minutes to build
- You'll see "Building" status in the Firebase Console
- Once complete, the status will change to "Enabled"

## 4. Test the Application

After completing the setup:

1. **Sign in** with your Google account
2. **Add a test expense** to verify write operations
3. **Navigate to expenses page** to verify read operations
4. **Try deleting an expense** to verify delete operations

## 🔍 Troubleshooting

### Common Issues:

1. **"Missing or insufficient permissions"**
   - Ensure security rules are published
   - Verify you're signed in with Google

2. **"The query requires an index"**
   - Wait for indexes to finish building
   - Check index status in Firebase Console

3. **"Network error"**
   - Check internet connection
   - Verify Firebase configuration in environment files

### Verify Setup:

1. **Security Rules**: Go to Firestore → Rules (should show custom rules)
2. **Indexes**: Go to Firestore → Indexes → Composite (should show 2 enabled indexes)
3. **Authentication**: Go to Authentication → Users (should show your Google account)

## 📊 Expected Database Structure

Once working, your Firestore will have:

```
expenses (collection)
├── [auto-generated-id-1]
│   ├── userId: "your-google-uid"
│   ├── amount: 25.50
│   ├── description: "Coffee"
│   └── date: Timestamp
├── [auto-generated-id-2]
│   ├── userId: "your-google-uid"
│   ├── amount: 12.99
│   ├── description: "Lunch"
│   └── date: Timestamp
└── ...
```

## 🚀 Next Steps

After setup is complete:

1. Test data migration from local storage
2. Verify cross-device synchronization
3. Test offline/online functionality
4. Review data in Firebase Console

---

**Note**: The auto-generated links in the console errors are the fastest way to create the exact indexes needed. Simply click them and confirm the index creation.