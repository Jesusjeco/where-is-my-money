# Authentication & Routing Troubleshooting Guide

## 🔐 Current Issue: Cannot Access Expenses Page

You're experiencing authentication-related issues preventing access to the expenses page. Here's how to resolve them:

## 1. Authentication Flow

### Expected Behavior:
1. **Unauthenticated users** → Redirected to `/login`
2. **Authenticated users** → Can access `/expenses` and `/home`
3. **Login page** → Only accessible to unauthenticated users

### Current Routes Protection:
```typescript
// Protected routes (require authentication)
'/' → Home (with authGuard)
'/home' → Home (with authGuard)
'/expenses' → ViewExpenses (with authGuard)

// Public routes (guest only)
'/login' → LoginComponent (with guestGuard)
```

## 2. Step-by-Step Resolution

### Step 1: Access the Login Page
1. Navigate to: `http://localhost:4200/login`
2. You should see the Google Sign-In button
3. If redirected away, clear browser cache and try again

### Step 2: Sign In with Google
1. Click "Sign in with Google"
2. Complete Google OAuth flow
3. After successful login, you'll be redirected to home page

### Step 3: Set Up Firestore (Critical)
**Before accessing expenses page, you MUST complete Firestore setup:**

1. **Follow the FIRESTORE_SETUP.md guide** to:
   - Create security rules
   - Set up database indexes
   - Configure permissions

2. **Without proper Firestore setup, you'll get:**
   - "The query requires an index" errors
   - "Missing or insufficient permissions" errors
   - Failed data loading

### Step 4: Test Expenses Page
1. After Firestore setup, navigate to: `http://localhost:4200/expenses`
2. You should see the expenses table (empty initially)
3. Try adding an expense from the home page

## 3. Common Issues & Solutions

### Issue: "Redirected to login repeatedly"
**Cause:** Authentication state not properly initialized
**Solution:**
```bash
# Clear browser data
1. Open DevTools (F12)
2. Application tab → Storage → Clear site data
3. Refresh page
4. Try signing in again
```

### Issue: "Google Sign-In popup blocked"
**Cause:** Browser blocking popups
**Solution:**
1. Allow popups for localhost:4200
2. Or try incognito/private browsing mode

### Issue: "Firebase errors in console"
**Cause:** Missing Firestore configuration
**Solution:**
1. Complete FIRESTORE_SETUP.md steps
2. Wait for indexes to build (5-10 minutes)
3. Refresh the application

### Issue: "Cannot read properties of null"
**Cause:** Trying to access user data before authentication
**Solution:**
- This should be handled by auth guards
- If persists, check browser console for specific errors

## 4. Debug Authentication State

### Check Current Auth Status:
1. Open browser DevTools (F12)
2. Console tab
3. Type: `localStorage` and press Enter
4. Look for Firebase auth tokens

### Verify User State:
1. In the application, check if user profile appears
2. Look for user avatar/name in the UI
3. Check if "Sign Out" button is visible

## 5. Manual Testing Steps

### Test 1: Authentication Flow
```
1. Go to http://localhost:4200/
   → Should redirect to /login

2. Go to http://localhost:4200/login
   → Should show Google Sign-In

3. Sign in with Google
   → Should redirect to home page
   → Should show user profile

4. Go to http://localhost:4200/expenses
   → Should show expenses page (after Firestore setup)
```

### Test 2: Route Protection
```
1. While signed in, go to /login
   → Should redirect away from login

2. Sign out
   → Should redirect to /login

3. Try to access /expenses while signed out
   → Should redirect to /login
```

## 6. Emergency Reset

If authentication is completely broken:

```bash
# 1. Clear all browser data
# 2. Stop the development server
npm stop

# 3. Clear Angular cache
rm -rf .angular/cache

# 4. Restart server
npm start

# 5. Try authentication flow again
```

## 7. Expected Console Output

### Successful Authentication:
```
✅ Firebase Auth initialized
✅ User signed in: [user-email]
✅ Redirecting to home page
```

### Firestore Errors (Expected until setup):
```
❌ FirebaseError: The query requires an index
❌ Missing or insufficient permissions
```

## 8. Next Steps

1. **First Priority:** Complete Firestore setup (FIRESTORE_SETUP.md)
2. **Second Priority:** Test authentication flow
3. **Third Priority:** Test expense operations

---

**Remember:** The Firestore errors are expected until you complete the database setup. The authentication should work independently of Firestore configuration.