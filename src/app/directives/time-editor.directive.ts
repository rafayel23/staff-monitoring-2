import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Directive({
  selector: 'input[type=time]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TimeEditorDirective,
      multi: true,
    }
  ]
})
export class TimeEditorDirective implements ControlValueAccessor {

  @HostListener('input', ['$event.target'])
  onInput(host: HTMLInputElement) {
    const [hour, minute] = host.value.split(':');
    const timestamp = moment(this.initialTimestamp).set('hour', +hour).set('minute', +minute).valueOf();
    this.onChange(timestamp);
  }

  @HostBinding('value')
  displayValue: string;

  
  onChange: (val: number) => void;
  registerOnChange(fn: (val: number) => void): void {
    this.onChange = fn;
  }
  
  onTouched: () => void;
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  writeValue(timestamp: number): void {
    this.displayValue = moment(timestamp).format('HH:mm');
    this.initialTimestamp = timestamp;
  }

  private initialTimestamp: number;

}


@Directive({
  selector: 'input[type=time][diffSrc]',
})
export class TimeDiffDirective {

  @Input()
  diffSrc: FormGroup;

  @HostBinding('value')
  get diff(): string {
    const {clockOut, clockIn} = this.diffSrc.value;
    return moment.utc(clockOut - clockIn).format('HH:mm');
  }

  @HostBinding('disabled')
  disabled = true;
}