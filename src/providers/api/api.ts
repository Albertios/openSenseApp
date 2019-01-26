import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class ApiProvider {

  private API_URL = 'https://api.opensensemap.org/boxes';
  private exposure = '?exposure=outdoor';
  private boxId = '5837219353fb45000f9478b0'; //Westfälisches Pferdemuseum Münster (station)
  private graphBoxId = '';
  // private sensorId = '593bcd656ccf3b0011791f5b';
  // private sat24Location = 'DE'; // https://en.sat24.com/en/freeimages
  // private sat24Url = 'https://api.sat24.com/animated/' + this.sat24Location + '/rainTMC/2/Central%20European%20Standard%20Time/9553668';

  constructor(public http: HttpClient) {
    console.log('Hello ApiProvider Provider');
  }

  setBoxId(boxId) {
    this.boxId = String(boxId);
  }

  getBoxId() {
    return this.boxId;
  }

  setGraphBoxId(boxId) {
    this.graphBoxId = String(boxId);
  }

  getGraphBoxId() {
    return this.graphBoxId;
  }

  setSensorId(sensorId) {
    this.boxId = String(sensorId);
  }

  getData() {
    return this.http.get(`${this.API_URL}${this.exposure}`);
  }

  getSenseboxData() {
    return this.http.get(this.API_URL + "/" + this.boxId);
  }

  getGraphSenseboxData() {
    return this.http.get(this.API_URL + "/" + this.graphBoxId);
  }

  getSenseboxDataFromId(boxId) {
    return this.http.get(this.API_URL + "/" + boxId);
  }

  getSensorData(sensorId) {
    let today = new Date();
    let oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    let urlString = this.API_URL + "/:" + this.boxId + "/data/" + sensorId + "?from-date=" + oneWeekAgo.toISOString() + "&to-date=" + today.toISOString() + "&format=json";
    return this.http.get(urlString);

  }

  getGraphSensorData(sensorId) {
    let today = new Date();
    let oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    let urlString = this.API_URL + "/:" + this.graphBoxId + "/data/" + sensorId + "?from-date=" + oneWeekAgo.toISOString() + "&to-date=" + today.toISOString() + "&format=json";
    return this.http.get(urlString);

  }
}
