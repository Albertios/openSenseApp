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

    { title: 'WeatherApp', component: 'WeatherAppPage' },
  ];
  weatherPages: Array<{ title: string, component: any }> = [
    { title:'Home', component: "WeatherAppPage"},
    { title: 'Forecast', component: 'ForecastPage' },
    { title: 'Analytics', component: 'GraphsPage' },
    { title: 'About', component: 'AboutPage' },
    //{ title: 'Introduction', component:'IntroductionPage'},
    { title: 'Back', component: HomePage },

  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);

    if (page.component === "WeatherAppPage" || page.component === "ForecastPage" || page.component === "GraphsPage"
      || page.component === "AboutPage" /*|| page.component==="IntroductionPage"*/) {
      document.getElementById('homeNavList').hidden = true;
      document.getElementById('navList').hidden = false;


    } else {

      document.getElementById('navList').hidden = true;
      document.getElementById('homeNavList').hidden = false;
    }

  }
}

