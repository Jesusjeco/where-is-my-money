import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Expense {
  id?: number;
  amount: number;
  description: string;
  date: Date;
}

export interface ExpenseInput {
  amount: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoneyBrowserStorage {
  private dbName = 'MoneyTrackerDB';
  private dbVersion = 1;
  private storeName = 'expenses';
  private db: IDBDatabase | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.initDB();
    }
  }

  private async initDB(): Promise<void> {
    if (!this.isBrowser || typeof indexedDB === 'undefined') {
      console.warn('IndexedDB not available in this environment');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          
          // Create indexes for better querying
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('amount', 'amount', { unique: false });
          
          console.log('Object store created');
        }
      };
    });
  }

  async addExpense(expense: ExpenseInput): Promise<number> {
    if (!this.isBrowser) {
      console.warn('Cannot add expense: not in browser environment');
      return Promise.resolve(0);
    }

    await this.ensureDBReady();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const expenseWithDate: Expense = {
        ...expense,
        date: new Date()
      };
      
      const request = store.add(expenseWithDate);
      
      request.onsuccess = () => {
        console.log('Expense added successfully with ID:', request.result);
        resolve(request.result as number);
      };
      
      request.onerror = () => {
        console.error('Error adding expense:', request.error);
        reject(request.error);
      };
    });
  }

  async getAllExpenses(): Promise<Expense[]> {
    if (!this.isBrowser) {
      console.warn('Cannot get expenses: not in browser environment');
      return Promise.resolve([]);
    }

    await this.ensureDBReady();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        console.error('Error getting expenses:', request.error);
        reject(request.error);
      };
    });
  }

  async deleteExpense(id: number): Promise<void> {
    if (!this.isBrowser) {
      console.warn('Cannot delete expense: not in browser environment');
      return Promise.resolve();
    }

    await this.ensureDBReady();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => {
        console.log('Expense deleted successfully');
        resolve();
      };
      
      request.onerror = () => {
        console.error('Error deleting expense:', request.error);
        reject(request.error);
      };
    });
  }

  async getTotalAmount(): Promise<number> {
    if (!this.isBrowser) {
      return Promise.resolve(0);
    }

    const expenses = await this.getAllExpenses();
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  private async ensureDBReady(): Promise<void> {
    if (!this.isBrowser) {
      return Promise.resolve();
    }
    
    if (!this.db) {
      await this.initDB();
    }
  }
}
