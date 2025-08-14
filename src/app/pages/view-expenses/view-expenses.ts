import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RecentExpensesTable } from '../../components/recent-expenses-table/recent-expenses-table';
import { UserProfileComponent } from '../../components/user-profile/user-profile.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-view-expenses',
  imports: [RecentExpensesTable, UserProfileComponent],
  templateUrl: './view-expenses.html',
  styleUrl: './view-expenses.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewExpenses {
  authService = inject(AuthService);
}
