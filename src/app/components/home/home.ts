import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { AuthService } from '../../services/auth.service';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [UserProfileComponent, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {
  private storage = inject(FirestoreService);
  authService = inject(AuthService);
  
  amount = signal(0);
  description = signal('');
  isLoading = signal(false);

  onAmountChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value) || 0;
    this.amount.set(value);
  }

  onDescriptionChange(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    this.description.set(value);
  }

  onFormSubmit(event: Event): void {
    event.preventDefault();
    this.addExpense();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.isLoading()) {
      event.preventDefault();
      this.addExpense();
    }
  }

  async addExpense(): Promise<void> {
    if (this.amount() <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    this.isLoading.set(true);

    try {
      const expenseId = await this.storage.addExpense({
        amount: this.amount(),
        description: this.description().trim()
      });

      console.log('Expense saved successfully with ID:', expenseId);
      
      // Reset form
      this.amount.set(0);
      this.description.set('');
      
      // Show success message
      alert('Expense added successfully and saved to cloud!');
      
    } catch (error) {
       console.error('Error saving expense:', error);
       alert('Error saving expense. Please try again.');
     } finally {
      this.isLoading.set(false);
    }
  }
}
