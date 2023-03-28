import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  totalEmployeesAmount$: Observable<number>;
  totalClockedInHours$: Observable<number>;
  totalRegularPay$: Observable<number>;
  totalOvertimePay$: Observable<number>;
  summaryVisible: boolean;

  constructor(private state: StateService) {}

  ngOnInit() {
    this.totalEmployeesAmount$ = this.state.totalEmployeesAmount$;
    this.totalClockedInHours$ = this.state.totalClockedInHours$;
    this.totalRegularPay$ = this.state.totalRegularPay$;
    this.totalOvertimePay$ = this.state.totalOvertimePay$;
  }
}
