import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IntroductionPage } from '../pages/introduction/introduction';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class openSenseApp {

  @ViewChild(Nav) nav: Nav;

  rootPage:any = IntroductionPage;
  rootHome:any = HomePage;

  pages: Array<{ title: string, component: any }> = [
    { title: 'WeatherBox', component: 'WeatherAppPage' },
  ];
  weatherPages: Array<{ title: string, component: any }> = [
    { title:'Home', component: "WeatherAppPage"},
    { title: 'Forecast', component: 'ForecastPage' },
    { title: 'Analytics', component: 'GraphsPage' },
    { title: 'About', component: 'AboutPage' },
    { title: 'Back', component: HomePage },
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);

    if (page.component === "WeatherAppPage" || page.component === "ForecastPage" || page.component === "GraphsPage"
      || page.component === "AboutPage") {
      document.getElementById('homeNavList').hidden = true;
      document.getElementById('navList').hidden = false;

    } else {
      document.getElementById('navList').hidden = true;
      document.getElementById('homeNavList').hidden = false;
    }
  }
}

