import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';

import { openSenseApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ApiProvider } from '../providers/api/api';
import { HttpClientModule } from '@angular/common/http';

import { LeafletPage } from '../pages/leaflet/leaflet';
import { LeafletPageModule } from '../pages/leaflet/leaflet.module';

import { RadarMapPage} from "../pages/radar-map/radar-map";
import { RadarMapPageModule} from "../pages/radar-map/radar-map.module";

import { HttpModule} from '@angular/http'; 
import { DataProvider} from '../providers/api/data'; 



import {IntroductionPageModule} from "../pages/introduction/introduction.module";
import {IntroductionPage} from "../pages/introduction/introduction";




@NgModule({
  declarations: [
    openSenseApp,
    HomePage,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(openSenseApp),
    IonicStorageModule.forRoot(),
    LeafletPageModule,
    RadarMapPageModule,
    IntroductionPageModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    openSenseApp,
    HomePage,
    LeafletPage,
    RadarMapPage,
    IntroductionPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    DataProvider,
    IonicStorageModule,
    SocialSharing
  ]
})
export class AppModule {}
