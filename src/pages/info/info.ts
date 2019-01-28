import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})

export class InfoPage {
  itemInfo: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.itemInfo = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }
}