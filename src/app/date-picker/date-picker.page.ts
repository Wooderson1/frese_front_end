import {Component, Input, OnInit} from '@angular/core';
import {ModalController, PickerController} from "@ionic/angular";
import * as moment from "moment";
import {DataServiceService} from "../services/data-service.service";
import {PickerOptions} from "@ionic/core"

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.page.html',
  styleUrls: ['./date-picker.page.scss'],
})
export class DatePickerPage implements OnInit {
  pickupTime;
  todayTime;
  todayDate;
  selections = {
    month: null,
    day: null,
    hour: null,
    minute: null
  };
  availableTimes = [];


  constructor(public modalController: ModalController,
              public dataService: DataServiceService,
              public pickerController: PickerController) {
  }

  async ngOnInit() {
    const months = this.getMonthValues();
    this.selections.month = months[0];
    const days = this.getDaysForMonth();
    this.selections.day = days[0];
    const hours = this.getHoursForDay();
    this.selections.hour = hours[0];
    const minutes = this.getMinutesForHour();
    this.selections.minute = minutes[0];
    this.todayDate = this.pickupTime.toISOString();
  }

  formatArrForPicker(arr) {
    return arr.map(val => {
      return {
        text: val,
        value: val
      }
    })

  }

  displayMonths() {
  }

  formatMonth(index) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[index]
  }

  getMinutesForHour() {
    const days = Object.keys(this.availableTimes).filter(date => {
      const d = new Date(date);
      return (d.getDate() === parseInt(this.selections.day) &&
              d.getMonth() === parseInt(this.selections.month) &&
              d.getHours() === parseInt(this.selections.hour));
    }).map(date => {
      const d = new Date(date);
      return d.getMinutes();
    });
    return [...new Set(days)];
  }

  getHoursForDay() {
    console.log("SEL ", this.selections);
    const days = Object.keys(this.availableTimes).filter(date => {
      const d = new Date(date);
      return (d.getDate() === parseInt(this.selections.day) && d.getMonth() === parseInt(this.selections.month));
    }).map(date => {
      const d = new Date(date);
      return d.getHours();
    });
    console.log("D ", [...new Set(days)]);
    return [...new Set(days)];
  }
  getDaysForMonth() {
    const days = Object.keys(this.availableTimes).filter(date => {
      const d = new Date(date);
      return d.getMonth() === parseInt(this.selections.month)
    }).map(date => {
      const d = new Date(date);
      return d.getDate();
    });
    return [...new Set(days)];
  }

  getPickerOptions(name, vals, field) {
    const binded = this.resetFieldsLowerThan.bind(this);
    return {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            console.log("New ", field, " = ", value[name].value);
            this.selections[field] = value[name].value;
            binded(field);
          }
        }
      ],
      columns: [
        {
          name: name,
          options: vals,
          selectedIndex: -1
        },
      ]
    };

  }

  getMonthValues() {
    const months = Object.keys(this.availableTimes || []).map(date => {
      const d = new Date(date);
      return (d.getMonth()).toString();
    });
    return [...new Set(months)];
  }

  getFormattedMonths() {
    return this.getMonthValues().map(val => {
      return this.formatMonth(val);
    })
  }
  formatHour(hours) {
    var suffix = hours < 12 ? "":"";
    return ((hours + 11) % 12 + 1) + suffix;
  }
  getMonth() {
    if(this.selections.month) {
      return this.selections.month;
    }
    const x = this.getMonth();
    return x[0];
  }
  getDay() {
    if(this.selections.day) {
      return this.selections.day;
    }
    const x = this.getDaysForMonth();
    return x[0];
  }
  getHour() {
    if(this.selections.hour) {
      return this.selections.hour;
    }
    const x = this.getHoursForDay();
    return x[0];
  }
  getMinute() {
    if(this.selections.minute) {
      return this.selections.minute;
    }
    const x = this.getMinutesForHour();
    return x[0];
  }

  resetFieldsLowerThan(field) {
    switch(field) {
      case 'month':
        this.selections.day = this.getDaysForMonth()[0]
        this.selections.hour = this.getHoursForDay()[0];
        this.selections.minute = this.getMinutesForHour()[0];
        break;
      case 'day':
        this.selections.hour = this.getHoursForDay()[0];
        this.selections.minute = this.getMinutesForHour()[0];
        break;
      case 'hour':
        this.selections.minute = this.getMinutesForHour()[0];
        break;
    }
  }

  async showMinutePicker() {
    const formattedMinutes = this.formatArrForPicker(this.getMinutesForHour());
    const options = this.getPickerOptions("Minute", formattedMinutes, "minute");
    let picker = await this.pickerController.create(options);
    await picker.present();
  }
  async showHourPicker() {
    const formattedHours = this.getHoursForDay().map(val => {
      return {
        text: this.formatHour(val),
        value: val
      }
    });
    const options = this.getPickerOptions("Hour", formattedHours, "hour");
    let picker = await this.pickerController.create(options);
    await picker.present();
  }
  async showDayPicker() {
    const formattedDays = this.formatArrForPicker(this.getDaysForMonth());
    console.log("DAY S", formattedDays);
    const options = this.getPickerOptions("Day", formattedDays, "day");
    let picker = await this.pickerController.create(options);
    await picker.present();
  }
  async showMonthPicker() {
    const formattedMonths = this.getMonthValues().map(val => {
      return {
        text: this.formatMonth(val),
        value: val
      }
    });
    const options = this.getPickerOptions("Month", formattedMonths, "month");
    let picker = await this.pickerController.create(options);
    await picker.present();
  }

  // async showDayPicker() {
  //   const options = this.getPickerOptions();
  //   let picker = await this.pickerController.create(options);
  //   await picker.present();
  //
  //   picker.addEventListener('ionPickerColChange', async (event: any) => {
  //     console.log("event ", event);
  //     if (event.detail.name === "Month") {
  //       let index = event.detail.selectedIndex;
  //       const vals = this.getMonthValues();
  //       this.selectedMonth = vals[index];
  //       const val = this.formatArrForPicker(this.getDaysForMonth());
  //       console.log("v ", val);
  //       picker.columns[1].options = val;
  //       let opts = this.getPickerOptions();
  //       picker = await this.pickerController.create(opts);
  //       await picker.present();
  //     }
  //   })
  // }

  formatDate() {
    const d = this.pickupTime;
    const hours = d.getHours() > 12 ? (d.getHours() - 12).toLocaleString('en-US', {minimumIntegerDigits: 2}) : d.getHours();
    const minutes = d.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2});
    const AMPM = d.getHours() >= 12 ? 'PM' : 'AM';
    return [d.getMonth() + 1,
        d.getDate(),
        d.getFullYear()].join('/') + ' ' +
      [hours,
        minutes].join(':') + " " + AMPM;
  }


  submitAndExit() {
    let { hour, minute, day, month } = this.selections;

    const date = new Date();
    const todayMonth = date.getMonth();
    if(month < todayMonth) {
      date.setFullYear(date.getFullYear() +1);
    }
    date.setHours(hour);
    date.setMinutes(minute);
    date.setDate(day);
    date.setMonth(month);

    this.modalController.dismiss({
      newDate: true,
      pickupTime: date
    });

  }

}
