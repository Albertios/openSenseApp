import { Component } from '@angular/core';

import {ApiProvider} from "../../providers/api/api";

import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { LeafletPage } from '../leaflet/leaflet';


@IonicPage()
@Component({
  selector: 'page-weather-app',
  templateUrl: 'weather-app.html',
  })

export class WeatherAppPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeatherAppPage');
    this.refresh_data();
  }


  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.api.getData().subscribe(res => {
      console.log(res);
      this.boxData = res;
      console.log('Refresh was clicked');
    });

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

refresh_data(){
  this.api.getData().subscribe(res => {
    console.log(res);
    this.boxData = res;
  console.log('Refresh was clicked');
  })
}

/*
auto update?
task = setInterval(() => {
  this.refresh_data();
}, 1000000);
*/

  locate_click(){
  // popover leaflet.html
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create( LeafletPage, {} , { cssClass: 'custom_popover' });
    popover.present({
      ev: myEvent
    });
  }

  refresh_click() {
    console.log('Refresh was clicked');
  }

  locate_click() {
    console.log('Locate was clicked');
  }

  search_click() {
    console.log('Search was clicked');
  }


}
