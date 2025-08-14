import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule],
  template: `
    @if (authService.userProfile(); as profile) {
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center space-x-4">
          @if (profile.photoURL) {
            <img 
              [src]="profile.photoURL" 
              [alt]="profile.displayName || 'User'"
              class="w-16 h-16 rounded-full object-cover"
            >
          } @else {
            <div class="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
          }
          
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900">
              {{ profile.displayName || 'User' }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ profile.email }}
            </p>
          </div>
          
          <button
            (click)="signOut()"
            [disabled]="isSigningOut()"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (isSigningOut()) {
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing out...
            } @else {
              <svg class="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Sign Out
            }
          </button>
        </div>
        
        @if (error()) {
          <div class="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span class="block sm:inline">{{ error() }}</span>
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  
  isSigningOut = signal(false);
  error = signal<string | null>(null);
  
  async signOut(): Promise<void> {
    this.isSigningOut.set(true);
    this.error.set(null);
    
    try {
      await this.authService.signOut();
      console.log('User signed out successfully');
      await this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Sign-out error:', error);
      this.error.set('Failed to sign out. Please try again.');
    } finally {
      this.isSigningOut.set(false);
    }
  }
}