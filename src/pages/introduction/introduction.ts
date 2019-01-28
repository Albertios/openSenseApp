import { Component,ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {HomePage} from "../home/home";

@IonicPage()
@Component({
  selector: 'page-introduction',
  templateUrl: 'introduction.html',

})
export class IntroductionPage {
  @ViewChild(Slides) slides: Slides;
  skipMsg: string = "Skip";
  state: string = 'x';
  constructor(public navCtrl: NavController,  public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroductionPage');
  }

  skip() {
    this.navCtrl.setRoot(HomePage); //.push(HomePage);
  }

  slideChanged() {
    if (this.slides.isEnd())
      this.skipMsg = "Alright, I got it";
  }

  slideMoved() {
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex())
      this.state = 'rightSwipe';
    else
      this.state = 'leftSwipe';
  }
}



