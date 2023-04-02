import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { map, Observable, startWith, tap, withLatestFrom } from 'rxjs';
import { Employee } from 'src/app/models/employee.model';
import { Shift } from 'src/app/models/shift.model';
import { StateService } from 'src/app/services/state.service';
import { SummaryService } from 'src/app/services/summary.service';

@Component({
  selector: 'app-shift-editor',
  templateUrl: './shift-editor.component.html',
  styleUrls: ['./shift-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiftEditorComponent implements OnInit {

  @Input()
  employee: Employee;

  shifts$: Observable<Shift[]>;
  form: FormArray;
  dateControl = this.fb.control(null, {updateOn: 'blur'});

  constructor(private state: StateService, private summary: SummaryService, private fb: FormBuilder) { }

  ngOnInit() {
    this.shifts$ = this.dateControl.valueChanges.pipe(
      startWith(null),
      withLatestFrom(this.state.shifts$),
      map(([date, shifts]) => {
        return this.summary
        .findEmployeeShifts(this.employee, shifts)
        .filter(shift => !date || moment(shift.clockIn).isSame(date, 'date'))
      }),
      tap(shifts => {
        this.form = this.fb.array(shifts.map(shift => this.fb.group(shift)))
      })
    )
  }

  getGroupAt(i: number) {
    return this.form.at(i) as FormGroup;
  }

}
