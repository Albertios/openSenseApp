import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'

@Injectable()
export class DataProvider {
  lists: any = [
    {
      itemName: 'Metadata',
      size: 'weather app',
    },
  ];

  constructor() {
    console.log('Hello DataProvider Provider');
  }

}