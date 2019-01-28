import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherProvider {
  apiKey = 'a7cb79c16b7fdcf5cef6cd05d9f03ff2';
  url;

  constructor(public http: Http) {
    console.log('Hello WeatherProvider Provider');
    //this.url='http://api.openweathermap.org/data/2.5/forecast?q=';
    this.url = 'http://api.openweathermap.org/data/2.5/weather?units=metric&';

  }

  getWeather(city, code) {
    return this.http.get(this.url + city + ',' + code + '&APPID=' + this.apiKey).map(res =>
      res.json());
  }

  getWeatherCoords(lat, lon) {
    return this.http.get(this.url + "lat=" + lat + '&' + "lon=" + lon + '&APPID=' + this.apiKey).map(res =>
      res.json());
  }
}

