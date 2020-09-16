import { Component } from '@angular/core';
import { UserServiceService } from "./http.service";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //LINE CHART
  title = 'Line Chart (Time-Temperature)';
  type = 'LineChart';
  options = {
    hAxis: {
      title: 'Time'
    },
    vAxis: {
      title: 'Temperature'
    },
    width: 1000,
    height: 600
  };
  data = [
    ["Jan", 7.0],
    ["Feb", 6.9],
    ["Mar", 9.5],
    ["Apr", 14.5],
    ["May", 18.2],
    ["Jun", 21.5],
    ["Jul", 25.2],
    ["Aug", 26.5],
    ["Sep", 23.3],
    ["Oct", 18.3],
    ["Nov", 13.9],
    ["Dec", 9.6]
  ];

  //TABLE
  datas = [];
  weatherData: any = [];
  numbers = [];

  //HEAT INDEX CALCULATION
  controlAirTemperature = new FormControl();
  controlHumidity = new FormControl();
  T = null;
  rh = null;
  radioButtonChecked = 'celsia';
  actualHeatIndex: any = 'Please insert both values';
  temperature = null;


  constructor(private user: UserServiceService) {
    this.user.getData().subscribe(result => {
      this.weatherData = result;
      //VLOŽENIE DO this.numbers ČÍSLA KU GRAFU
      var i = 0;
      this.weatherData.forEach(element => {
        this.numbers = [element.created, element.the_temp];
        this.datas.push(this.numbers);
        if (i != 10) {
          i++;
        }
      });
    });

    this.controlAirTemperature.valueChanges.subscribe(value => {
      this.T = value;
      if (this.T == null || this.rh == null) {
        this.actualHeatIndex = 'Please insert both values';
      } else {
        this.countAndChangeHeatIndex();
      }
    });

    this.controlHumidity.valueChanges.subscribe(value => {
      this.rh = value;
      if (this.rh == null || this.T == null) {
        this.actualHeatIndex = 'Please insert both values';
      } else if (this.T != 0) {
        this.countAndChangeHeatIndex();
      }
    });
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
  }
}
