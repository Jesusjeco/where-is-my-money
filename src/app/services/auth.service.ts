import { Injectable, inject, signal, computed } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private googleProvider = new GoogleAuthProvider();
  
  // Current user observable from Firebase
  user$: Observable<User | null> = user(this.auth);
  
  // Reactive user state
  private currentUser = signal<User | null>(null);
  
  // Computed user profile
  userProfile = computed<UserProfile | null>(() => {
    const user = this.currentUser();
    if (!user) return null;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
  });
  
  // Computed authentication state
  isAuthenticated = computed(() => this.currentUser() !== null);
  
  constructor() {
    // Subscribe to auth state changes
    this.user$.subscribe(user => {
      this.currentUser.set(user);
    });
  }
  
  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<UserProfile | null> {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const user = result.user;
      
      if (user) {
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }
  
  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
  
  /**
   * Get the current user's UID
   */
  getCurrentUserId(): string | null {
    return this.currentUser()?.uid || null;
  }
  
  /**
   * Check if user is currently authenticated
   */
  isUserAuthenticated(): boolean {
    return this.isAuthenticated();
  }
}