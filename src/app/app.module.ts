import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { openSenseApp } from './app.component';
import { HomePage } from '../pages/home/home';
import{ DataProvider} from '../providers/data/data';
import { HttpClientModule } from '@angular/common/http';
import { SettingsPage} from '../pages/settings/settings';
import { WeatherProvider } from '../providers/weather/weather';
import { SettingsPageModule } from '../pages/settings/settings.module';
import {Http} from '@angular/http';
import{HttpModule} from '@angular/http';

import {IonicStorageModule} from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';







@NgModule({
  declarations: [
    openSenseApp,
    HomePage,
    
  ],
  imports: [
  
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(openSenseApp),
    SettingsPageModule,
    HttpModule,
    IonicStorageModule.forRoot()
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    openSenseApp,
    HomePage,
    SettingsPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    WeatherProvider,
    IonicStorageModule,
    SocialSharing
    
  ]

 })
export class AppModule {}
