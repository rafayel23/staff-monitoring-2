import { Injectable } from '@angular/core';
import { REGULAR_HOURS_LIMIT } from '../constants';
import { Employee } from '../models/employee.model';
import { Shift } from '../models/shift.model';
import { ShiftManagerService } from './shift-manager.service';


@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor(private shiftManager: ShiftManagerService) { }

  public getTotalClockedInHours (shifts: Shift[]) {
    return this.computeClockedInHours(shifts);
  }

  public getTotalRegularPay (employees: Employee[], shifts: Shift[]) {
    return employees.reduce((total, emplyee) => total + this.getEmployeeRegularPay(emplyee, shifts), 0);
  }

  public getTotalOvertimePay (employees: Employee[], shifts: Shift[]) {
    return employees.reduce((total, emplyee) => total + this.getEmployeeOvertimePay(emplyee, shifts), 0);
  }

  public getEmployeeClockedInHours(employee: Employee, shifts: Shift[]): number {
    const employeeShifts = this.findEmployeeShifts(employee, shifts);
    return this.computeClockedInHours(employeeShifts);
  }

  public getEmployeeRegularPay(employee: Employee, shifts: Shift[]): number {
    const employeeShifts = this.findEmployeeShifts(employee, shifts);
    return this.computeRegularHours(employeeShifts) * employee.hourlyRate;
  }

  public getEmployeeOvertimePay(employee: Employee, shifts: Shift[]): number {
    const employeeShifts = this.findEmployeeShifts(employee, shifts);
    return this.computeOvertimeHours(employeeShifts) * employee.hourlyRateOvertime;
  }

  public findEmployeeShifts(employee: Employee, shifts: Shift[]): Shift[] {
    return shifts.filter(shift => shift.employeeId === employee.id);
  }

  

  /* --- private methods --- */
  
  private computeClockedInHours(shifts: Shift[]): number {
    return shifts.reduce((total, {clockIn, clockOut}) => {
      return total + this.convertToHours(clockOut - clockIn);
    }, 0)
  }

  private computeRegularHours(shifts: Shift[]): number {
    shifts = this.shiftManager.normalizeOffsets(shifts);

    return this.shiftManager
    .groupByDate(shifts)
    .reduce((total, shiftsForToday) => {
      const clockedInHours = this.computeClockedInHours(shiftsForToday);
      const regularHours = clockedInHours > REGULAR_HOURS_LIMIT ? REGULAR_HOURS_LIMIT : clockedInHours;
      return total + regularHours;
    }, 0)
  }

  private computeOvertimeHours(shifts: Shift[]): number {
    shifts = this.shiftManager.normalizeOffsets(shifts);

    return this.shiftManager
    .groupByDate(shifts)
    .reduce((total, shiftsForToday) => {
      const clockedInHours = this.computeClockedInHours(shiftsForToday);
      const overtimeHours = clockedInHours <= REGULAR_HOURS_LIMIT ? 0 : clockedInHours - REGULAR_HOURS_LIMIT;
      return total + overtimeHours;
    }, 0)
  }

  private convertToHours(ms: number): number {
    return ms / (1000 * 3600);
  }

}
