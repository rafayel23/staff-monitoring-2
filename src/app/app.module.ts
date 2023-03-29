import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatTableModule } from '@angular/material/table'
import { MatDialogModule } from '@angular/material/dialog'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppComponent } from './app.component';
import { SummaryComponent } from './components/summary/summary.component';
import { EmployeeTableComponent } from './components/employee-table/employee-table.component'
import { BulkEditComponent } from './components/bulk-edit/bulk-edit.component';
import { EmployeeEditorComponent } from './components/bulk-edit/employee-editor/employee-editor.component';
import { ShiftEditorComponent } from './components/bulk-edit/shift-editor/shift-editor.component';

import { SyncRefDirective } from './directives/sync-ref.directive';
import { TimeDiffDirective, TimeEditorDirective } from './directives/time-editor.directive';

import { ApiService } from './services/api.service';
import { StateService } from './services/state.service';
import { forkJoin } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    SummaryComponent,
    EmployeeTableComponent,
    BulkEditComponent,
    EmployeeEditorComponent,
    ShiftEditorComponent,
    SyncRefDirective,
    TimeEditorDirective,
    TimeDiffDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {
        appearance: 'outline'
      }
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (api: ApiService, state: StateService) => {
        forkJoin([api.getShifts(), api.getEmployees()]).subscribe(([shifts, employees]) => {
          state.setShifts(shifts);
          state.setEmployees(employees);
        })
      },
      deps: [ApiService, StateService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

