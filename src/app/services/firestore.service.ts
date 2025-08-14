import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, where, Timestamp } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Expense, ExpenseInput } from './money-browser-storage';

export interface FirestoreExpense {
  id?: string;
  amount: number;
  description: string;
  date: Timestamp;
  // Note: userId is no longer needed as it's implicit in the collection path
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);
  
  /**
   * Get the user-specific collection path for expenses
   * Structure: users/{userId}/expenses
   * This creates separate collections per user for better performance and analytics
   */
  private getUserExpensesCollection(userId: string) {
    return collection(this.firestore, 'users', userId, 'expenses');
  }
  
  /**
   * Add a new expense to Firestore
   */
  async addExpense(expenseInput: ExpenseInput): Promise<string> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated to add expenses');
    }
    
    try {
      const expenseData: Omit<FirestoreExpense, 'id'> = {
        amount: expenseInput.amount,
        description: expenseInput.description,
        date: Timestamp.fromDate(new Date())
        // userId is no longer stored in the document as it's implicit in the collection path
      };
      
      const userExpensesCollection = this.getUserExpensesCollection(userId);
      const docRef = await addDoc(userExpensesCollection, expenseData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding expense to Firestore:', error);
      throw error;
    }
  }
  
  /**
   * Get all expenses for the current user
   */
  async getAllExpenses(): Promise<Expense[]> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated to view expenses');
    }
    
    try {
      // Query the user-specific collection - no need to filter by userId anymore
      const userExpensesCollection = this.getUserExpensesCollection(userId);
      const q = query(
        userExpensesCollection,
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const expenses: Expense[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreExpense;
        expenses.push({
          id: doc.id as any, // Firestore uses string IDs
          amount: data.amount,
          description: data.description,
          date: data.date.toDate() // Convert Firestore Timestamp to Date
        });
      });
      
      return expenses;
    } catch (error) {
      console.error('Error getting expenses from Firestore:', error);
      throw error;
    }
  }
  
  /**
   * Delete an expense by ID
   */
  async deleteExpense(expenseId: string): Promise<void> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated to delete expenses');
    }
    
    try {
      // Delete from the user-specific collection
      const userExpensesCollection = this.getUserExpensesCollection(userId);
      await deleteDoc(doc(userExpensesCollection, expenseId));
    } catch (error) {
      console.error('Error deleting expense from Firestore:', error);
      throw error;
    }
  }
  
  /**
   * Get total amount of all expenses for the current user
   */
  async getTotalAmount(): Promise<number> {
    try {
      const expenses = await this.getAllExpenses();
      return expenses.reduce((total, expense) => total + expense.amount, 0);
    } catch (error) {
      console.error('Error calculating total amount:', error);
      throw error;
    }
  }
  
  /**
   * Get expenses for a specific date range
   */
  async getExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      throw new Error('User must be authenticated to view expenses');
    }
    
    try {
      // Query the user-specific collection with date range - much simpler without userId filter
      const userExpensesCollection = this.getUserExpensesCollection(userId);
      const q = query(
        userExpensesCollection,
        where('date', '>=', Timestamp.fromDate(startDate)),
        where('date', '<=', Timestamp.fromDate(endDate)),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const expenses: Expense[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreExpense;
        expenses.push({
          id: doc.id as any, // Firestore uses string IDs
          amount: data.amount,
          description: data.description,
          date: data.date.toDate()
        });
      });
      
      return expenses;
    } catch (error) {
      console.error('Error getting expenses by date range:', error);
      throw error;
    }
  }
}