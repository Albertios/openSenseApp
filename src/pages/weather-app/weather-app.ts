import { Component } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { LeafletPage } from '../leaflet/leaflet';
import { RadarMapPage } from '../radar-map/radar-map';
import { SocialSharing } from '@ionic-native/social-sharing';
import { WeatherProvider } from '../../providers/api/weather';
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-weather-app',
  templateUrl: 'weather-app.html',
  providers: [WeatherProvider]
})

export class WeatherAppPage {
  boxData: any;
  weather: any;
  tempSensor: boolean;
  message: string = null;
  file: string = null;
  link: string = null;
  subject: string = null;
  sunrise: any;
  sunset: any;
  weatherConditionStringImagePath: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,
              private api: ApiProvider, private socialSharing: SocialSharing, public WeatherProvider: WeatherProvider,
              public alertController: AlertController) {
  }

  share() {
    this.socialSharing.share(this.message, this.file, this.link, this.subject)
      .then(() => {

      }).catch(() => {

    });
  }

  //onload refresh data
  ionViewDidLoad() {
    console.log('ionViewDidLoad WeatherAppPage');
    this.refresh_data();
  }

  //pull down refresh data
  doRefresh(refresher) {
    this.api.getSenseboxData().subscribe(res => {
      this.boxData = res;
      this.refresh_data();
    });

    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  //get data
  refresh_data() {
    this.api.getSenseboxData().subscribe(res => {
      this.boxData = res;
      this.buildTimeStamp();
      this.getReplacementData();
      this.replaceData();
      this.getReplacementData();
    })
  }

  //opens leaflet popover with the senseboxes
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(LeafletPage, {}, {cssClass: 'custom_popover'});
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(() => {
      this.refresh_data();
    })
  }

  //opens leaflet radar map popover
  presentPopoverRadarMap(myEvent) {
    let popover = this.popoverCtrl.create(RadarMapPage, {}, {cssClass: 'custom_popover'});
    popover.present({
      ev: myEvent
    });
  }

  // create timestamp that will show under sensebox name in the img
  buildTimeStamp() {
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

  //get missing sensebox date from openWeatherMap https://openweathermap.org/
  getReplacementData() {
    this.WeatherProvider.getWeatherCoords(this.boxData.currentLocation.coordinates[1],
      this.boxData.currentLocation.coordinates[0]).subscribe(weather => {
      this.weather = weather;

      // get sunrise & sunset and convert it to hh:mm
      this.sunrise = this.weather.sys.sunrise;
      this.sunrise = new Date(this.sunrise * 1000).toLocaleTimeString();
      this.sunset = this.weather.sys.sunset;
      this.sunset = new Date(this.sunset * 1000).toLocaleTimeString();

      //get weather condition id and based on the id save img path
      let weatherTyp = this.weather.weather[0].id;

      if (weatherTyp >= 200 && weatherTyp < 300) {
        this.weatherConditionStringImagePath = "../../assets/imgs/storm.jpg";
      } else if (weatherTyp >= 300 && weatherTyp < 400) {
        this.weatherConditionStringImagePath = "../../assets/imgs/drizzle.jpg";
      } else if (weatherTyp >= 500 && weatherTyp < 600) {
        this.weatherConditionStringImagePath = "../../assets/imgs/rain.gif";
      } else if (weatherTyp >= 600 && weatherTyp < 700) {
        this.weatherConditionStringImagePath = "../../assets/imgs/snow.gif";
      } else if (weatherTyp === 800) {
        this.weatherConditionStringImagePath = "../../assets/imgs/clear.jpg";
      } else if (weatherTyp >= 801 && weatherTyp < 805) {
        // img taken by Sarah Lechler :)
        this.weatherConditionStringImagePath = "../../assets/imgs/clouds.jpg";
      }
    });
  }


  replaceData() {

    //get current date and convert it to ==> dd:mm:yyyy
    let day: any = new Date().getDate();
    let month: any = new Date().getMonth();
    let year: any = new Date().getFullYear();

    month = +month;
    if (month < 9) {
      month = month + 1;
      month = "0" + month;
    } else {
      month = month + 1;
    }

    day = +day;
    if (day < 9) {
      day = "0" + day;
    }

    let currDate = day + "." + month + "." + year;

    // go through sensors and look for sensor name "Temperatur" and last update is today ==> oms temp will not shown on
    // landing page otherwise the temperature of owm completes the list
    for (let i = 0; i < this.boxData.sensors.length; i++) {
      if (this.boxData.sensors[i].title === "Temperatur" && this.boxData.date === currDate) {
        this.tempSensor = false;
      } else if (this.tempSensor != false) {
        this.tempSensor = true;
      }
    }
  }

  showOWMAlert() {
    const alert = this.alertController.create({
      title: 'OpenWeatherMap',
      subTitle: 'Your selected Sensebox does not have the sensor or the data is more than one day old. This displayed value is from openweathermap.org.',
      buttons: ['OK']
    });
    alert.present();
  }
}
