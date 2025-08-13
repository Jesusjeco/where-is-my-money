import { Component } from '@angular/core';
import { RecentExpensesTable } from '../../components/recent-expenses-table/recent-expenses-table';

@Component({
  selector: 'app-view-expenses',
  imports: [RecentExpensesTable],
  templateUrl: './view-expenses.html',
  styleUrl: './view-expenses.scss'
})
export class ViewExpenses {

}
