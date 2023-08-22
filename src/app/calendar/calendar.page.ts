import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  constructor() { }
  getDateCal() {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear().toString();
    return `${month}${day}${year}`;
  }
  getCalendarSrc() {
    return `https://storage.googleapis.com/frese-product-images/${this.getDateCal()}calendar.jpg?ignoreCache=1`
  }
  ngOnInit() {
  }

}
