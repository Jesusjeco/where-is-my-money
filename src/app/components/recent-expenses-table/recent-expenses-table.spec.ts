import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentExpensesTable } from './recent-expenses-table';
import { MoneyBrowserStorage } from '../../services/money-browser-storage';
import { PLATFORM_ID } from '@angular/core';

describe('RecentExpensesTable', () => {
  let component: RecentExpensesTable;
  let fixture: ComponentFixture<RecentExpensesTable>;
  let mockStorage: jasmine.SpyObj<MoneyBrowserStorage>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MoneyBrowserStorage', ['getAllExpenses', 'deleteExpense']);

    await TestBed.configureTestingModule({
      imports: [RecentExpensesTable],
      providers: [
        { provide: MoneyBrowserStorage, useValue: spy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecentExpensesTable);
    component = fixture.componentInstance;
    mockStorage = TestBed.inject(MoneyBrowserStorage) as jasmine.SpyObj<MoneyBrowserStorage>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load expenses on init', async () => {
    const mockExpenses = [
      { id: 1, amount: 100, description: 'Test expense', date: new Date() }
    ];
    mockStorage.getAllExpenses.and.returnValue(Promise.resolve(mockExpenses));

    await component.ngOnInit();

    expect(mockStorage.getAllExpenses).toHaveBeenCalled();
    expect(component.expenses()).toEqual(mockExpenses);
    expect(component.isLoading()).toBeFalse();
  });

  it('should format date correctly', () => {
    const testDate = new Date('2024-01-15T10:30:00');
    const formatted = component.formatDate(testDate);
    expect(formatted).toContain('Jan');
    expect(formatted).toContain('15');
    expect(formatted).toContain('2024');
  });

  it('should format amount as currency', () => {
    const amount = 123.45;
    const formatted = component.formatAmount(amount);
    expect(formatted).toBe('$123.45');
  });

  it('should delete expense when confirmed', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockStorage.deleteExpense.and.returnValue(Promise.resolve());
    mockStorage.getAllExpenses.and.returnValue(Promise.resolve([]));

    await component.deleteExpense(1);

    expect(mockStorage.deleteExpense).toHaveBeenCalledWith(1);
    expect(mockStorage.getAllExpenses).toHaveBeenCalled();
  });

  it('should not delete expense when not confirmed', async () => {
    spyOn(window, 'confirm').and.returnValue(false);

    await component.deleteExpense(1);

    expect(mockStorage.deleteExpense).not.toHaveBeenCalled();
  });
});