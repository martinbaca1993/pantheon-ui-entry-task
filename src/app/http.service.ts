import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http:HttpClient) { }
  getData() {
    let url='https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/44418/2018/4/30/';
    return this.http.get(url);
  }
}
