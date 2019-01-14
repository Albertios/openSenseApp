import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import leaflet from 'leaflet';
import {HttpClient} from '@angular/common/http';
import {ApiProvider} from '../../providers/api/api';

@IonicPage()
@Component({
  selector: 'page-radar-map',
  templateUrl: 'radar-map.html',
})
export class RadarMapPage {

  @ViewChild('rainviewerMap') mapContainer: ElementRef;
  rainviewerMap: any;
  bounds: any;
  timeArray: any;
  framePosition: any = 0;
  overlays: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RadarMapPage');
    this.loadRainViewerMap();
  }

  loadRainViewerMap() {

    //ToDo: setView to current marker
    this.rainviewerMap = leaflet.map('rainviewerMap', {zoomControl: false}).setView([52, 7],5)
    let currentSenseBox = this.api.getData();
    console.log(currentSenseBox);
    currentSenseBox.toPromise().then( res => {
      console.log(res)
      this.rainviewerMap.setView([res.currentLocation.coordinates[1], res.currentLocation.coordinates[0]], 5);
    })

    //get current date / time
    let sampleDate = new Date();
    // convert the date in hours
    let hours = sampleDate.getHours();

    // based on the time another basic map is displayed (light or dark)
    if (hours > 7 && hours < 18) {
      leaflet.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: "<a href=\"http://github.com/Albertios\" title=\"one of the creators of the app\">Albertios</a>",
        maxZoom: 7
      }).addTo(this.rainviewerMap);
      this.setBounds();

      //this.loadOverLay();
    } else {
      leaflet.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        attribution: "<a href=\"http://github.com/Albertios\" title=\"one of the creators of the app\">Albertios</a>",
        maxZoom: 7,
      }).addTo(this.rainviewerMap);
      this.setBounds();
    }
    this.getRemoteData();

    let legend = leaflet.control({position: 'bottomleft'});


    legend.onAdd = function () {

      let div = leaflet.DomUtil.create('div', 'info legend'),
        grades = ["Drizzle (probably)", "Drizzle", "Light Rain", "Light Rain", "Rain", "Rain", "Heavy Rain", "Heavy Rain", "Storm", "Storm", "Hail", "Hail"],
        labels = ["#88eeee","#0099cc","#0077aa", "#005588", "#ffee00", "#ffaa00", "#ff7700", "#ff4400", "#ee0000", "#990000", "#ffaaff", "#ff77ff" ];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' +  labels[i] + '"></i>' +
          grades[i] + (grades[i] ? '<br>' : '');
      }

      return div;
    };

    legend.addTo(this.rainviewerMap);


  }

  //the boundaries are set here, based on the ImageOverlay
  setBounds() {
    this.bounds = new leaflet.LatLngBounds(
      new leaflet.LatLng(-180.0, -180.0),
      new leaflet.LatLng(180.0, 180.0));

    // show boundaries
    //leaflet.rectangle(this.bounds).addTo(this.rainviewerMap);
    //this.rainviewerMap.fitBounds(this.bounds);
  }

  //get a time JSON with 13 time values
  getRemoteData() {
    this.http.get('https://tilecache.rainviewer.com/api/maps.json')
      .toPromise().then(response => {
      this.timeArray = response;

      //creates 13 ImageOverlay and saved them in an array
      for (let i = 0; i < this.timeArray.length; i++) {
        this.overlays.push(
          new leaflet.ImageOverlay("https://tilecache.rainviewer.com/v2/composite/" + this.timeArray[i] + "/8000.png?color=2", this.bounds, {
            opacity: 0.5,
            interactive: true,
            attribution: "<a href=\"http://www.rainviewer.com\" title=\"radar data from RainViewer\">RainViewer</a>"
          })
        );
      }


      //displays single layers one after the other
      //ToDo: for a better transition always two layers are displayed ==> The problem is, it's all blurry. How to get better transitions?

      setInterval(response => {

        //reset the framePosition back to 0 ==> we get an animation like GIF
        if (this.framePosition === this.timeArray.length) {
          // remove image layer if it already exists
          if (this.rainviewerMap.hasLayer(this.overlays[this.framePosition - 2])) {
            this.rainviewerMap.removeLayer(this.overlays[this.framePosition - 2]);
            this.rainviewerMap.removeLayer(this.overlays[this.framePosition - 1]);
          }

          this.framePosition = 0;
          this.overlays[this.framePosition].addTo(this.rainviewerMap);
          this.framePosition += 1;

        } else {
          // remove image layer if it already exists
          if (this.rainviewerMap.hasLayer(this.overlays[this.framePosition - 2])) {
            this.rainviewerMap.removeLayer(this.overlays[this.framePosition - 2]);
          }
          this.overlays[this.framePosition].addTo(this.rainviewerMap);
          this.framePosition += 1;
        }
      }, 1000);
    });
  }
}
