import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Expense } from '../../services/money-browser-storage';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-expenses-table',
  imports: [CommonModule],
  templateUrl: './recent-expenses-table.html',
  styleUrl: './recent-expenses-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentExpensesTable implements OnInit {
  private storage = inject(FirestoreService);
  
  expenses = signal<Expense[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadRecentExpenses();
  }

  async loadRecentExpenses(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      
      const allExpenses = await this.storage.getAllExpenses();
      
      // Sort by date (newest first) and take the latest 15
      const recentExpenses = allExpenses
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 15);
      
      this.expenses.set(recentExpenses);
    } catch (err) {
      console.error('Error loading expenses:', err);
      this.error.set('Failed to load expenses. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteExpense(id: string | number): Promise<void> {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await this.storage.deleteExpense(id.toString());
      // Reload the expenses after deletion
      await this.loadRecentExpenses();
    } catch (err) {
      console.error('Error deleting expense:', err);
      this.error.set('Failed to delete expense. Please try again.');
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }


}