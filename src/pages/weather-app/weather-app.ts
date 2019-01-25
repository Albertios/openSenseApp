import { Component } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { LeafletPage } from '../leaflet/leaflet';
import { RadarMapPage } from '../radar-map/radar-map';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-weather-app',
  templateUrl: 'weather-app.html',
})

export class WeatherAppPage {
  boxData: any;

  message: string = null;
  file: string = null;
  link: string = null;
  subject: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController, private api: ApiProvider, private socialSharing: SocialSharing) {
  }

  share() {
    this.socialSharing.share(this.message, this.file, this.link, this.subject)
      .then(() => {

      }).catch(() => {

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WeatherAppPage');
    this.refresh_data();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.api.getSenseboxData().subscribe(res => {
      console.log(res);
      this.boxData = res;
      console.log('doRefresh()');
      this.refresh_data();
    });

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }


  refresh_data() {
    this.api.getSenseboxData().subscribe(res => {
      console.log(res);
      this.boxData = res;
      console.log('refresh_data()');
      this.buildTimeStamp();
    })
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(LeafletPage, {}, { cssClass: 'custom_popover' });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(() => {
      this.refresh_data();
    })
  }


  presentPopoverRadarMap(myEvent) {
    let popover = this.popoverCtrl.create(RadarMapPage, {}, { cssClass: 'custom_popover' });
    popover.present({
      ev: myEvent
    });
  }

  buildTimeStamp(){
    let time_data = (this.boxData.updatedAt);
    let split_data = time_data.split("T");

    let box_date = split_data[0];
    box_date = box_date.replace("-", ".");
    box_date = box_date.replace("-", ".");
    box_date = box_date.split(".");
    box_date = box_date[2].concat(".".concat(box_date[1].concat(".".concat((box_date[0])))));


    let box_time = split_data[1];
    box_time = box_time.split(".");
    box_time = box_time[0];
    
    this.boxData.date = box_date;
    this.boxData.time = box_time;
  }
}
