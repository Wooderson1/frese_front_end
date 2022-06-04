import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {from, Subject, Subscription} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {SpinnerService} from "../services/spinner.service";

@Directive({
  selector: '[appDebounceClick]'
})
export class DebounceClickDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 500;
  @Output() debounceClick = new EventEmitter();
  private clicks = new Subject();
  private subscription: Subscription;

  constructor(private spinner: SpinnerService) { }

  async ngOnInit() {
    this.subscription = this.clicks.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(e => this.debounceClick.emit(e));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    this.spinner.showSpinner();
    event.preventDefault();
    event.stopPropagation();
    console.log("HERE");
    this.clicks.next(event);
    this.spinner.hideSpinner();
  }
}
