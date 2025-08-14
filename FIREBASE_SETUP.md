# Firebase Integration Setup

This application now supports Firebase authentication and cloud storage for your expenses.

## Features

### 🔐 Authentication
- **Google Sign-In**: Secure authentication using your Google account
- **Automatic routing**: Unauthenticated users are redirected to login
- **User profile**: Display user information and sign-out option

### 💾 Data Storage
- **Cloud storage**: All expenses are stored securely in Firestore
- **Real-time sync**: Data syncs across all your devices instantly
- **User isolation**: Each user's data is completely separate and secure
- **Reliable backup**: Your data is safely stored in Google's cloud infrastructure

### 🔄 Data Synchronization
- **Instant sync**: Changes appear immediately across all devices
- **Automatic backup**: All data is continuously backed up to the cloud
- **Cross-device access**: Access your expenses from any device
- **Secure storage**: Data is encrypted and stored securely

## How It Works

### For New Users
1. Visit the app and click "Sign in with Google"
2. Start adding expenses - they're automatically saved to your cloud account
3. Access your data from any device by signing in

### For Existing Users (with local data)
1. Sign in with Google
2. You'll see a migration prompt if you have local expenses
3. Click "Migrate to Cloud" to transfer your data
4. Your expenses are now synced across all devices

### Storage Behavior
- **Authentication required**: All users must sign in to use the app
- **Cloud-first**: All expenses are saved directly to Firestore
- **Real-time updates**: Changes sync instantly across devices

## Security

### Firestore Security Rules
The app uses Firestore Security Rules to ensure:
- Users can only access their own data
- All operations require authentication
- Data is validated before saving

### Authentication
- Uses Firebase Auth with Google provider
- No passwords stored locally
- Secure token-based authentication

## Technical Details

### Services
- **AuthService**: Handles Google Sign-In and user state
- **FirestoreService**: Manages all cloud data operations
- **Authentication Guards**: Protect routes and ensure user authentication

### Components
- **LoginComponent**: Google Sign-In interface
- **UserProfileComponent**: User info and sign-out
- **RecentExpensesTable**: Displays and manages expense data

### Guards
- **authGuard**: Protects routes requiring authentication
- **guestGuard**: Redirects authenticated users from login page

## Environment Configuration

Firebase configuration is stored in:
- `src/environments/environment.ts` (development)
- `src/environments/environment.prod.ts` (production)

## Development

### Running the App
```bash
npm start
```

### Building for Production
```bash
npm run build
```

The app will automatically use the appropriate Firebase configuration based on the build environment.

## Troubleshooting

### Common Issues

1. **"Sign in failed"**: Check if pop-ups are blocked in your browser
2. **"Network error"**: Ensure you have internet connection
3. **"Permission denied"**: Verify Firestore security rules are properly configured

### Browser Compatibility
- Modern browsers with JavaScript enabled
- Pop-up support required for Google Sign-In
- Internet connection required for all operations

### Data Safety
- All data is automatically backed up to Google Cloud
- Data is encrypted in transit and at rest
- User data is isolated and secure

## 🚀 Next Steps

After setup is complete:

1. Sign in with your Google account
2. Add your first expense to test functionality
3. Verify cross-device synchronization
4. Review data in Firebase Console

## Support

If you encounter any issues:
1. Check browser console for error messages
2. Ensure you're using a supported browser
3. Verify internet connection for cloud features
4. Try signing out and back in