import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeatherAppPage } from './weather-app';
import { LeafletPageModule } from '../leaflet/leaflet.module';
import { StatsPageModule } from '../stats/stats.module';

@NgModule({
  declarations: [
    WeatherAppPage
  ],
  imports: [
    IonicPageModule.forChild(WeatherAppPage),
    LeafletPageModule,
    StatsPageModule
  ],
})
export class WeatherAppPageModule {}
