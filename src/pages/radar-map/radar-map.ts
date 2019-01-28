import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ApiProvider } from '../../providers/api/api';
import leaflet from 'leaflet';

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

    this.rainviewerMap = leaflet.map('rainviewerMap').setView([52, 7], 5);
    let currentSenseBox: any = this.api.getSenseboxData();
    // set map view to the current selected sensebox && shows the current selected sensebox as a marker
    currentSenseBox.toPromise().then(res => {
      let senseBoxIcon = new leaflet.Icon({
        iconSize: [40, 40],
        iconAnchor: [13, 27],
        popupAnchor: [1, -24],
        iconUrl: '../assets/imgs/markerBlue.png'
      });
      this.rainviewerMap.setView([res.currentLocation.coordinates[1], res.currentLocation.coordinates[0]], 5);
      let marker = new leaflet.marker([res.currentLocation.coordinates[1], res.currentLocation.coordinates[0]], { icon: senseBoxIcon });
      marker.addTo(this.rainviewerMap);
    });

    //to change the text color in the map legend
    let timeDiv: any;
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
      timeDiv = 'divDay';

    } else {
      leaflet.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        attribution: "<a href=\"http://github.com/Albertios\" title=\"one of the creators of the app\">Albertios</a>",
        maxZoom: 7
      }).addTo(this.rainviewerMap);
      this.setBounds();
      timeDiv = 'divNight';
    }

    this.getRemoteData();

    //create the legend (color bricks and description)
    let legend = leaflet.control({ position: 'bottomleft' });
    legend.onAdd = function () {

      //set legend values (color and description)
      let div = leaflet.DomUtil.create(timeDiv, 'info legend'),
        grades = ["Drizzle (probably)", "Drizzle", "Light Rain", "Light Rain", "Rain", "Rain", "Heavy Rain", "Heavy Rain", "Storm", "Storm", "Hail", "Hail"],
        labels = ["#88eeee", "#0099cc", "#0077aa", "#005588", "#ffee00", "#ffaa00", "#ff7700", "#ff4400", "#ee0000", "#990000", "#ffaaff", "#ff77ff"];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:' + labels[i] + '"></i>' +
          grades[i] + (grades[i] ? '<br>' : '');
      }
      return div;
    };
    legend.addTo(this.rainviewerMap);

    //remove the zoom control
    this.rainviewerMap.removeControl(this.rainviewerMap.zoomControl);
  }

  //the boundaries are set here, based on the ImageOverlay (https)
  setBounds() {
    this.bounds = new leaflet.LatLngBounds(
      new leaflet.LatLng(-180.0, -180.0),
      new leaflet.LatLng(180.0, 180.0));
  }

  //convert Unix time into hours:minutes
  Unix_timestamp(t) {
    let dt = new Date(t * 1000);
    let hr = dt.getHours();
    let m = "0" + dt.getMinutes();
    return hr + ':' + m.substr(-2);
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

        let timeLegend = leaflet.control({ position: 'bottomleft' });
        //displays single layers one after the another
        //ToDo: for a better transition always two layers are displayed ==> The problem is, it's a little bit blurry. How to get better transitions?
        setInterval(response => {

          //reset the framePosition back to 0 ==> we get an animation like GIF
          if (this.framePosition === this.timeArray.length) {
            // remove image layer if it already exists
            if (this.rainviewerMap.hasLayer(this.overlays[this.framePosition - 2])) {
              this.rainviewerMap.removeLayer(this.overlays[this.framePosition - 2]);
              this.rainviewerMap.removeLayer(this.overlays[this.framePosition - 1]);
            }
            //reset framePosition ==> starts with the first layer
            this.framePosition = 0;
            this.overlays[this.framePosition].addTo(this.rainviewerMap);
            this.framePosition += 1;

          } else {
            // remove image layer if it already exists
            if (this.rainviewerMap.hasLayer(this.overlays[this.framePosition - 2])) {
              this.rainviewerMap.removeLayer(this.overlays[this.framePosition - 2]);
            }
            this.overlays[this.framePosition].addTo(this.rainviewerMap);

            //convert Unix_timestamp JSON String into hours and minutes
            let displayedTime = this.Unix_timestamp(this.timeArray[this.framePosition]);
            //a small black time div box will created and will be shown over the map legend
            timeLegend.onAdd = function () {

              let div = leaflet.DomUtil.create('div', 'info legend');

              div.innerHTML +=
                '<i id="time" style="background:' + 'black' + '">' + displayedTime + '</i>';

              return div;
            };

            timeLegend.addTo(this.rainviewerMap);
            this.framePosition += 1;
          }
        }, 1000);
      });
  }
}
