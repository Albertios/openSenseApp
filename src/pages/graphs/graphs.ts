import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { LeafletPage } from '../leaflet/leaflet';
import Chart from 'chart.js/dist/Chart.js';

/**
 * Generated class for the LeafletPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'graphs.html',
})
export class GraphsPage {
  sensorChart: any;
  statisticData: any;
  sensorData: any = [];
  unit: any;
  chartData: any = [];
  box: boolean;
  boxData: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider, public popoverCtrl: PopoverController, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.loadSensorDropDown();
    this.refresh_data();
  }

  //leaflet popover for changing sensebox for graphs
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(LeafletPage, {}, { cssClass: 'custom_popover' });
    popover.present({
      ev: myEvent
    });
  }

  //populate sensor drop down based on available sensors of the selected sensebox
  loadSensorDropDown() {
    this.api.getSenseboxData().subscribe(data => {
      let sensorarray: any = data;
      this.sensorData = [];
      sensorarray.sensors.forEach(sensor => {
        this.sensorData.push({
          title: sensor.title,
          value: sensor._id + "," + sensor.unit
        });
      });
    })
  }

  checkForSenseboxData() {
    if (this.box) { //check if this works!!
      if (this.api.getGraphBoxId() === '') {
        let alert = this.alertCtrl.create({
          title: 'No Box selected',
          subTitle: 'Please select a box on the map to be able to compare the data as graph ',
          buttons: ['Dismiss']
        });
        alert.present();
        this.box = false;
        return;
      }
      this.addSenseboxDataToChart()
    } else {
      if (this.api.getGraphBoxId() != '') {
        this.loadSensorDropDown();
        if (this.sensorChart.data.datasets.length > 1) {
          this.sensorChart.data.datasets.pop();
          this.sensorChart.update();
        }
      }
    }
  }

  //populate drop down based on available sensors of the selected sensebox
  addSenseboxDataToChart() {
    if (this.api.getGraphBoxId() === '') {
      return;
    };
    if (this.sensorChart) {
      this.sensorChart.destroy();
    }
    this.api.getGraphSenseboxData().subscribe(data => {
      let sensorarray: any = data;
      let sensorData = [];
      sensorarray.sensors.forEach(sensor => {
        this.sensorData.forEach((dropDownSensor, index, object) => {
          if (dropDownSensor.title === sensor.title) {
            sensorData.push({
              title: sensor.title,
              value: dropDownSensor.value + ',' + sensor._id
            })
          }
        })
      });
      this.sensorData = sensorData;
    })
  }

  //populate chart based on the selected sensor
  populateChart(sensorValue) {
    let sensorId = sensorValue.split(",")[0];
    this.unit = sensorValue.split(",")[1];
    let graphSensorId = sensorValue.split(",")[2];
    let data = this.api.getSensorData(sensorId);
    data.subscribe(sensorData => {
      let sensorDataArray: any = sensorData;
      let ctx: any = document.getElementById("boxChart");
      //if no data is available print a hint on screen
      if (sensorDataArray.length < 1) {
        if (this.sensorChart) {
          this.sensorChart.destroy();
        }
        let alert = this.alertCtrl.create({
          title: 'No Data available',
          subTitle: 'For the selected box is no data available for this sensor.',
          buttons: ['Dismiss']
        });
        alert.present();
        return;
      }
      let splittedArray = this.splitIntoDaysArray(sensorDataArray);
      this.chartData = this.getMinAndMax(splittedArray[0]);
      let chartLabel = splittedArray[1];
      this.createChart(chartLabel, this.chartData, ctx);
      if (this.api.getGraphBoxId() != '' && graphSensorId) {
        this.api.getGraphSensorData(graphSensorId).subscribe(sensorData => {
          let sensorsArray: any = sensorData;
          if (sensorsArray.length < 1) {
            let alert = this.alertCtrl.create({
              title: 'No Data available',
              subTitle: 'For the selected box is no data available for this sensor.',
              buttons: ['Dismiss']
            });
            alert.present();
            return;
          }
          let splittedBoxArray = this.splitIntoDaysArray(sensorsArray);
          let chartBoxData: any = this.getMinAndMax(splittedBoxArray[0]);
          this.sensorChart.data.datasets.push({
            label: "Compared Box",
            data: chartBoxData,
            backgroundColor: [
              'rgba(1, 177, 215, 0.5)'
            ],
            borderColor: [
              'rgba(1, 175, 215,1)'
            ],
            borderWidth: 1
          });
          this.sensorChart.update();
        })
      }
    });
  }

  //create chart
  createChart(chartLabel, chartData, ctx) {
    if (this.sensorChart) {
      this.sensorChart.destroy();
    }
    this.sensorChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabel,
        datasets: [{
          label: "Preferred Box",
          data: chartData,
          backgroundColor: [
            'rgba(78, 175, 71, 0.5)'
          ],
          borderColor: [
            'rgba(78, 175, 71,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: this.unit},
            stacked: true,
            gridLines: {
              display: true,
              color: "rgba(255,99,132,0.2)"
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        }
      }
    });
  }

  //split the sensor data into data for each day, find min and max values for each day and create labals for data
  splitIntoDaysArray(array) {
    let arrayForCreatedAtArrays = [];
    let createdAt = array[0].createdAt.split("T")[0];
    let labelArray = [];
    console.log(createdAt);
    let tempArray = [];
    array.forEach((entry) => {
      if (entry.createdAt.split("T")[0] === createdAt) {
        tempArray.push(entry)
      } else {
        arrayForCreatedAtArrays.push(tempArray);
        tempArray = [];
        labelArray.unshift(createdAt.substring(5) + " min");
        labelArray.unshift(createdAt.substring(5) + " max");
        createdAt = entry.createdAt.split("T")[0];
      }
    });
    return [arrayForCreatedAtArrays, labelArray];
  }

  // get min and max values of data arrays
  getMinAndMax(arrays) {
    let chartData = [];
    let minValue = 200;
    let maxValue = -200;
    arrays.forEach(array => {
      array.forEach(entry => {
        if (entry.value < minValue) {
          minValue = entry.value
        }
        if (entry.value > maxValue) {
          maxValue = entry.value
        }
      });
      chartData.unshift(minValue);
      chartData.unshift(maxValue);
      minValue = 200;
      maxValue = -200;
    });
    return chartData;
  }

  refresh_data() {
    this.api.getSenseboxData().subscribe(res => {
      console.log(res);
      this.boxData = res;
      console.log('refresh_data()');
    })
  }
}
