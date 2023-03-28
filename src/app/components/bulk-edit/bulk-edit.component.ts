import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { Employee } from 'src/app/models/employee.model';
import { ApiService } from 'src/app/services/api.service';
import { StateService } from 'src/app/services/state.service';
import { SummaryService } from 'src/app/services/summary.service';
import { EmployeeEditorComponent } from './employee-editor/employee-editor.component';
import { ShiftEditorComponent } from './shift-editor/shift-editor.component';

@Component({
  selector: 'app-bulk-edit',
  templateUrl: './bulk-edit.component.html',
  styleUrls: ['./bulk-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BulkEditComponent implements OnInit {

  @ViewChildren(EmployeeEditorComponent)
  employeeEditors: QueryList<EmployeeEditorComponent>;

  @ViewChildren(ShiftEditorComponent)
  shiftEditors: QueryList<ShiftEditorComponent>;

  employees$: Observable<Employee[]>;

  constructor(private api: ApiService, private dialogRef: DialogRef, private state: StateService, private summary: SummaryService) {}

  ngOnInit() {
    this.employees$ = this.state.selectedEmployees$;
  }

  save() {
    const updateEmployeeRequests = this.employeeEditors
    .filter(editor => editor.form.dirty)
    .map(editor => this.api.updateEmployee(editor.form.value))

    const updateShiftRequests = this.shiftEditors
    .toArray()
    .flatMap(editor => editor.form.controls)
    .filter(form => form.dirty)
    .map(form => this.api.updateShift(form.value))

    forkJoin(updateEmployeeRequests).subscribe(employees => {
      this.state.updateEmployees(employees);
      this.dialogRef.close();
    });

    forkJoin(updateShiftRequests).subscribe(shifts => {
      this.state.updateShifts(shifts);
      this.dialogRef.close();
    })

  }
}
