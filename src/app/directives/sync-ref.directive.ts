import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Directive({
  selector: '[appSyncRef]'
})
export class SyncRefDirective<T> implements OnDestroy {

  subscription = new Subscription();

  @Input('appSyncRef')
  set asyncRef(observable: Observable<T>) {
    this.subscription.unsubscribe();

    this.subscription = observable.subscribe(value => {
      this.vcr.clear();
      this.vcr.createEmbeddedView(this.tmpRef, {$implicit: value});
    })
  }

  constructor(private vcr: ViewContainerRef, private tmpRef: TemplateRef<{$implicit: T}>) {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
