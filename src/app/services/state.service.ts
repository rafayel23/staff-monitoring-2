import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { Shift } from '../models/shift.model';
import { Statistics } from '../models/statistics.model';
import { SummaryService } from './summary.service';

type ID = { id: string };

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(private summary: SummaryService) {}

  private _shifts$ = new BehaviorSubject<Shift[]>([]);
  private _employees$ = new BehaviorSubject<Employee[]>([]);
  private _selectedEmployees$ = new BehaviorSubject<Employee[]>([]);

  public shifts$: Observable<Shift[]> = this._shifts$.asObservable().pipe(filter(arr => arr.length > 0));
  public employees$: Observable<Employee[]> = this._employees$.asObservable().pipe(filter(arr => arr.length > 0));
  public selectedEmployees$: Observable<Employee[]> = this._selectedEmployees$.asObservable();

  public totalEmployeesAmount$: Observable<number> = this.employees$.pipe(
    map(employees => employees.length)
  );

  public totalClockedInHours$: Observable<number> = this.shifts$.pipe(
    map(shifts => this.summary.getTotalClockedInHours(shifts))
  )

  public totalRegularPay$: Observable<number> = combineLatest([this._employees$, this.shifts$]).pipe(
    map(([employees, shifts]) => this.summary.getTotalRegularPay(employees, shifts))
  )

  public totalOvertimePay$: Observable<number> = combineLatest([this._employees$, this.shifts$]).pipe(
    map(([employees, shifts]) => this.summary.getTotalOvertimePay(employees, shifts))
  )

  public statistics$: Observable<Record<string, Statistics>> = combineLatest([this._employees$, this.shifts$]).pipe(
    map(([employees, shifts]) => employees.reduce((statistics, emp) => {
      return {
        ...statistics,
        [emp.id]: {
          clockedInHours: this.summary.getEmployeeClockedInHours(emp, shifts),
          regularPay: this.summary.getEmployeeRegularPay(emp, shifts),
          overtimePay: this.summary.getEmployeeOvertimePay(emp, shifts),
        }
      }
    }, {}))
  )

  public setEmployees(employees: Employee[]): void {
    this.set(this._employees$, employees)
  }

  public updateEmployees(employees: Employee[]): void {
    this.merge(this._employees$, employees);
  }

  public setShifts(shifts: Shift[]): void {
    this.set(this._shifts$, shifts)
  }

  public updateShifts(shifts: Shift[]): void {
    this.merge(this._shifts$, shifts);
  }

  public setSelectedEmployees(employees: Employee[]): void {
    this.set(this._selectedEmployees$, employees);
  }

  private set<T>(subject$: BehaviorSubject<T[]>, value: T[]): void {
    subject$.next(value);
  }

  private merge<T extends ID>(subject$: BehaviorSubject<T[]>, value: T[]): void {
    const currentStateMap = this.createMap(subject$.getValue());
    const upcomingStateMap = this.createMap(value);
    subject$.next(Object.values({ ...currentStateMap, ...upcomingStateMap }));
  }

  private createMap<T extends ID>(array: T[]): Record<string, T> {
    return array.reduce((map, record) => {
      return { ...map, ...{ [record.id]: record } }
    }, {});
  }
}
