import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BulkEditComponent } from '../bulk-edit/bulk-edit.component';
import { map, Observable, startWith, withLatestFrom } from 'rxjs';
import { StateService } from 'src/app/services/state.service';
import { Statistics } from 'src/app/models/statistics.model';

@Component({
  selector: 'app-employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.scss'],
})
export class EmployeeTableComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) 
  paginator: MatPaginator;

  employees$: Observable<Employee[]>;
  totalEmployeesAmount$: Observable<number>;
  statistics$: Observable<Record<string, Statistics>>;
  selection = new SelectionModel<Employee>(true, []);

  constructor(private dialog: MatDialog, private state: StateService) {}

  ngOnInit() {
    this.totalEmployeesAmount$ = this.state.totalEmployeesAmount$
    this.statistics$ = this.state.statistics$;

    this.selection.changed.subscribe(() => {
      this.state.setSelectedEmployees(this.selection.selected);
    })
    
    this.employees$ = this.paginator.page.pipe(
      startWith({pageIndex: 0, pageSize: 5}),
      withLatestFrom(this.state.employees$),
      map(([{pageIndex, pageSize}, employees,]) => {
        return employees.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
      })
    );
  }

  openEditorDialog() {
    this.dialog.open(BulkEditComponent, {
      width: '90%',
      disableClose: true,
    }).afterClosed().subscribe(() => {
      this.selection.clear();
    })
  }
}
