import { Injectable } from '@angular/core';
import { Shift } from '../models/shift.model';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ShiftManagerService {

  /* group shifts with the same date into separate arrays */
  public groupByDate(shifts: Shift[]): Shift[][] {

    const groups: Shift[][] = [];
    let currentGroup: Shift[] = [];

    shifts.forEach((shift, index) => {
        currentGroup.push(shift);
        const nextShift = shifts[index + 1];
  
        if (!nextShift ||  moment(shift.clockIn).date() !== moment(nextShift.clockIn).date()) {
          groups.push(currentGroup);
          currentGroup = [];
        }
    })

    return groups;
  }

  /* split shifts that cross midnight into two separate shifts */
  public normalizeOffsets(shifts: Shift[]): Shift[] {

    return shifts.flatMap((shift) => {
      const clockInDate = moment(shift.clockIn).date();
      const clockOutDate = moment(shift.clockOut).date();

      if (clockInDate === clockOutDate) {
        return shift;
      } else {
        return [
          {
            ...shift,
            clockOut: moment(shift.clockIn).endOf('day').valueOf()
          },
          {
            ...shift,
            clockIn: moment(shift.clockOut).startOf('day').valueOf(),
          }
        ]
      }
    })
  }

}
