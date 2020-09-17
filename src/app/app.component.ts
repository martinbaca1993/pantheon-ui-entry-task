import { Component, OnInit } from '@angular/core';
import { UserServiceService } from "./http.service";
import { FormControl } from '@angular/forms';
import * as Chart from 'chart.js';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
})
export class AppComponent {
  //TABLE
  weatherData: any = [];

  //HEAT INDEX CALCULATION
  controlAirTemperature = new FormControl();
  controlHumidity = new FormControl();
  T = null;
  rh = null;
  radioButtonChecked = 'celsia';
  actualHeatIndex: any = 'Please insert both values';
  temperature = null;

  //LINE CHART
  canvas: any;
  ctx: any;
  dataTime = [];
  dataTemperature = [];

  constructor(private user: UserServiceService, private datepipe: DatePipe) {
    this.user.getData().subscribe(result => {
      this.weatherData = result;
      this.createChart();
    });

    this.controlAirTemperature.valueChanges.subscribe(value => {
      this.T = value;
      if (this.T == null || this.rh == null) {
        this.actualHeatIndex = 'Please insert both values';
      } else {
        this.checkAirTemperature(value);
      }
    });

    this.controlHumidity.valueChanges.subscribe(value => {
      this.rh = value;
      if (this.rh == null || this.T == null) {
        this.actualHeatIndex = 'Please insert both values';
      } else if (this.T != 0) {
        this.checkAirTemperature(this.T);
      }
    });
  }

  checkAirTemperature(value) {
    if ((value < 26.7 && this.radioButtonChecked == 'celsia')) {
      this.actualHeatIndex = 'Temperature cannot be less then 26.7 °C!';
    } else if ((value < 80 && this.radioButtonChecked == 'farenhait')) {
      this.actualHeatIndex = 'Temperature cannot be less then 80 F!';
    } else {
      this.countAndChangeHeatIndex();
    }
  }

  countAndChangeHeatIndex() {
    var temp;
    if (this.radioButtonChecked == 'celsia') {
      temp = (9 / 5) * this.T + 32;
    } else {
      temp = this.T;
    }
    this.actualHeatIndex = -42.379 + (2.04901523 * temp) + (10.14333127 * this.rh)
      - (0.22475541 * temp * this.rh) - (6.83783 * Math.pow(10, -3) * Math.pow(temp, 2))
      - (5.481717 * Math.pow(10, -2) * Math.pow(this.rh, 2)) + (1.22874 * Math.pow(10, -3) * Math.pow(temp, 2) * this.rh)
      + (8.5282 * Math.pow(10, -4) * temp * Math.pow(this.rh, 2)) - (1.99 * Math.pow(10, -6) * Math.pow(temp, 2) * Math.pow(this.rh, 2));
  }

  onRadioButtonChange(value) {
    if (value == 'celsia') {
      this.T = (5 / 9) * (this.T - 32);
    } else {
      this.T = (9 / 5) * this.T + 32;
    }
    this.temperature = this.T;
    this.radioButtonChecked = value;
    this.checkAirTemperature(this.temperature);
  }

  createChart() {
    //PRÍPRAVA DÁT PRE LINE CHART
    this.weatherData.forEach(element => {
      this.dataTime.push(this.datepipe.transform(element.created, 'yyyy/MM/dd H:mm:ss'));
      this.dataTemperature.push(element.the_temp);
    });

    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    const myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.dataTime,
        datasets: [{
          label: 'Temperature',
          data: this.dataTemperature,
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          display: false
        },
        title: {
          display: true,
          fontSize: 20,
          text: 'RELATIONSHIP BETWEEN TIME(X-AXIS) AND TEMPERATURE(Y-AXIS)'
        },
        responsive: true,
        display: true,
        maintainAspectRatio: true
      }
    });
  }
}
