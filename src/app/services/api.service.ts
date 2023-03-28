import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_ROOT } from '../constants';
import { Employee } from '../models/employee.model';
import { Shift } from '../models/shift.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  public getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${API_ROOT}/employees`);
  }

  public getShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${API_ROOT}/shifts`);
  }

  public updateEmployee(employee: Partial<Employee>): Observable<Employee> {
    const {id, ...body} = employee;
    return this.http.patch<Employee>(`${API_ROOT}/employees/${id}`, body);
  }

  public updateShift(shift: Partial<Shift>): Observable<Shift> {
    const {id, ...body} = shift;
    return this.http.patch<Shift>(`${API_ROOT}/shifts/${id}`, body);
  }
}
