import {Component, ViewChild, ElementRef,} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, AlertController} from 'ionic-angular';
import {ApiProvider} from '../../providers/api/api';
import leaflet from 'leaflet';
import 'leaflet-search';
import 'leaflet.locatecontrol';

/**
 * Generated class for the LeafletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leaflet',
  templateUrl: 'leaflet.html',
})
export class LeafletPage {
  @ViewChild('map')
  mapContainer: ElementRef;
  map: any;
  boxData: any;
  boxLayer: any;
  currentSenseBox: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private elementRef: ElementRef, public viewCtr: ViewController, private api: ApiProvider, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.loadMap();
    console.log('ionViewDidLoad LeafletPage');
  }

  loadMap() {

    this.currentSenseBox = this.api.getSenseboxData();
    this.currentSenseBox.toPromise().then(res => {
      //initiate map
      this.map = leaflet.map('map', {zoomControl: false}).setView([res.currentLocation.coordinates[1], res.currentLocation.coordinates[0]], 13);

      //add tile layer to map
      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      //add location finder
      let lc = leaflet.control.locate({
        position: 'topright',
        strings: {
          setView: "once"
        }
      }).addTo(this.map);

      // add event for location found of location finder
      function onLocationFound(e) {
        console.log("You were located!")
      }

      // add event listener to map
      this.map.on('locationfound', this.getClosestSensebox, this);

      //add search and event function
      this.map.addControl(new leaflet.Control.Search({
        url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
        position: "topright",
        jsonpParam: 'json_callback',
        propertyName: 'display_name',
        propertyLoc: ['lat', 'lon'],
        marker: leaflet.marker([0, 0]),
        autoCollapse: true,
        autoType: false,
        minLength: 2
      }).on('search:locationfound', e => {
        console.log("Location Found");
        this.getClosestSensebox(e)
      }, this));

      this.loadSenseboxLayer();
    });
  }


  //function to get the closest sensbox to one's location or searched location
  getClosestSensebox(e) {
    let minDist = 100;
    let closestSenseboxID;
    this.boxData.forEach((box) => {
      let dist = this.distance(e.latlng, [parseFloat(box.currentLocation.coordinates[0]), parseFloat(box.currentLocation.coordinates[1])])
      if (minDist > dist) {
        minDist = dist;
        closestSenseboxID = box._id;
      }

    });

    let closestSenseBox: any = this.api.getSenseboxDataFromId(closestSenseboxID);
    // set map view to the current selected sensebox && shows the current selected sensebox as a marker
    closestSenseBox.toPromise().then(res => {
      this.map.fitBounds([[res.currentLocation.coordinates[1], res.currentLocation.coordinates[0]], [e.latlng.lat, e.latlng.lng]]);
    });
    this.changeMarkerColor('black', closestSenseboxID);

  };

  // calculate distance of two points(sensebox, one's location or searched location)
  distance(latlng1, latlng2) {
    let distance;
    if (latlng1.lat == latlng2[0] && latlng1.lng == latlng2[1]) {
      distance = 0
    } else {
      distance = Math.sqrt((Math.pow((latlng1.lat - latlng2[1]), 2) + Math.pow((latlng1.lng - latlng2[0]), 2)));
    }
    return distance;
  };

  // function to safe boxId after pushing 'set as preference' btn
  safeBoxId(e) {
    let id = e.target.id.substring(2);
    this.api.setBoxId(id);
    let alert = this.alertCtrl.create({
      title: 'Box selected',
      subTitle: 'The box was saved as preference',
      buttons: ['Ok']
    });
    alert.present();
    //closes popover after preference is selected
    this.viewCtr.dismiss();
  };

  safeGraphBoxId(e) {
    let id = e.target.id.substring(7);
    this.api.setGraphBoxId(id);
    let alert = this.alertCtrl.create({
      title: 'Box selected',
      subTitle: 'The box was saved to compare statistics on the analytics page',
      buttons: ['Ok']
    });
    alert.present();
    //closes popover after preference is selected
    this.viewCtr.dismiss();
  };

  // function to load the sensebox layer
  loadSenseboxLayer() {
    //create general icon
    let senseBoxIcon = new leaflet.Icon({
      iconSize: [40, 40],
      iconAnchor: [13, 27],
      popupAnchor: [1, -24],
      iconUrl: '../assets/imgs/markerGreen.png'
    });
    // load data from all senseboxes
    this.api.getData().subscribe(data => {
      let jsonData = JSON.stringify(data);
      this.boxData = JSON.parse(jsonData);
      this.boxLayer = leaflet.geoJSON('', {
        id: 'jsonLayer',
        pointToLayer: function (feature, latlng) {
          return leaflet.marker(latlng, {icon: senseBoxIcon});
        }

      }).addTo(this.map);
      // for each entry a geojson feature is created
      this.boxData.forEach((entry) => {
        let geojsonFeature = _createGeojsonFeaturen(entry);
        this.boxLayer.addData(geojsonFeature)
      });
      //popup template
      this.boxLayer.bindPopup((layer) => {
        //check if the popup that opens is from the selected sensebox
        if (layer.feature.properties.id != this.api.getBoxId()) {
          return leaflet.Util.template('<p><b>Box : </b>{name}<br>Last Measured on {lastMeasuredAt}<br><button id="id{id}" name="pref" data-id={id} ' +
            'value="prf">Set as preference</button><button id="graphId{id}" name="pref" data-id={id} value="prf">' +
            'Save for graph</button></p>', layer.feature.properties);
        } else {
          return '<p><b>Box: </b>' + layer.feature.properties.name + '<br>Last Measured on ' + layer.feature.properties.lastMeasuredAt+'<br><b>Selected sensebox </b></p>';
        }
      });

      // event for button in popup
      this.boxLayer.on('popupopen', (e) => {
        //check if the popup that opens is from the selected sensebox
        if (e.layer.feature.properties.id != this.api.getBoxId()) {
          this.elementRef.nativeElement.querySelector('#id' + e.popup._source.feature.properties.id)
            .addEventListener('click', this.safeBoxId.bind(this));
          this.elementRef.nativeElement.querySelector('#graphId' + e.popup._source.feature.properties.id)
            .addEventListener('click', this.safeGraphBoxId.bind(this));
        }
      });
      this.changeMarkerColor('blue', '');
      //TODO: close popup after clicking 'set as preference'
      //this.map.closePopup();

    });
  }

  // change the marker color of the selected sensebox
  //TODO: onclick change color
  changeMarkerColor(color, id) {
    // set map view to the current selected sensebox && shows the current selected sensebox as a marker
    if (color === 'blue') {
      this.currentSenseBox.toPromise().then(res => {
        //create selected icon
        let selectedSenseBoxIcon = new leaflet.Icon({
          iconSize: [40, 40],
          iconAnchor: [13, 27],
          popupAnchor: [1, -24],
          iconUrl: '../assets/imgs/markerBlue.png',
          className: 'blinking'
        });
        let layerID = res._id;
        //find layer of selected sensebox
        this.boxLayer.eachLayer(layer => {
          if (layer.feature.properties.id === layerID) {
            layer.setIcon(selectedSenseBoxIcon);
          }
        });
      });
    }
    if (color === 'black') {
      let selectedSenseBoxIcon = new leaflet.Icon({
        iconSize: [40, 40],
        iconAnchor: [13, 27],
        popupAnchor: [1, -24],
        iconUrl: '../assets/imgs/markerBlack.png',
        className: 'blinking'
      });
      let layerID = id;
      //find layer of nearest sensebox
      this.boxLayer.eachLayer(layer => {
        if (layer.feature.properties.id === layerID) {
          layer.setIcon(selectedSenseBoxIcon);
        }
      });
    }
  }
}


// function to create feature from json
let _createGeojsonFeaturen = (entry) => {
  if(entry.updatedAt){
    let time_data = (entry.updatedAt);
    let split_data = time_data.split("T");

    let box_date = split_data[0];
    box_date = box_date.replace("-", ".");
    box_date = box_date.replace("-", ".");
    box_date = box_date.split(".");
    box_date = box_date[2].concat(".".concat(box_date[1].concat(".".concat((box_date[0])))));


    let box_time = split_data[1];
    box_time = box_time.split(".");
    box_time = box_time[0];

    entry.updatedAt = box_date +" at " + box_time;
  }
  let geojsonFeature = {
    "type": "Feature",
    "properties": {
      "name": entry.name,
      "id": entry._id,
      "entry": entry,
      "lastMeasuredAt": entry.updatedAt,
      "popupContent": 'GoodBox!'
    },

    "geometry": {
      "type": "Point",
      "coordinates": [parseFloat(entry.currentLocation.coordinates[0]), parseFloat(entry.currentLocation.coordinates[1])]
    }
  };
  return geojsonFeature;
};
