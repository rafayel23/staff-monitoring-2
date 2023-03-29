import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from 'src/app/services/state.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent implements OnInit {

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
