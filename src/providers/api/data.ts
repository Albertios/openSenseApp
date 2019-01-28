import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'

@Injectable()
export class DataProvider {
  lists: any = [
    
    {itemName: 'APP',
    name:'APP NAME : WEATHER APP',
    version:' APP VERSION: 1.0.0',
    
    description:'This weather app is the mobile application supporting the major iphone and android platform. Equipped with location based technology to detect user locality, the application can automatically display the latest weather forecast for cities. The weather app get the weather data from sense box.The app  provide the weather data based on your location and provides current weather plus hourly weather forecasts up to one week in advance.',
    release: 'RELEASE DATE: 28.01.2019',
  },
  ];

  constructor() {
    console.log('Hello DataProvider Provider');
  }
}
