import { Component, signal, inject } from '@angular/core';
import { MoneyBrowserStorage } from '../../services/money-browser-storage';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  private storage = inject(MoneyBrowserStorage);
  
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
      alert('Expense added successfully!');
      
    } catch (error) {
       console.error('Error saving expense:', error);
       alert('Error saving expense. Please try again.');
     } finally {
      this.isLoading.set(false);
    }
  }
}
