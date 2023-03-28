import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employee-editor',
  templateUrl: './employee-editor.component.html',
  styleUrls: ['./employee-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeEditorComponent implements OnInit {

  @Input()
  employee: Employee;
  
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group(this.employee);
  }



}
