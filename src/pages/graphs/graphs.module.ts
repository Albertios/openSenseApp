import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GraphsPage } from './graphs';

@NgModule({
  declarations: [
    GraphsPage,
  ],
  imports: [
    IonicPageModule.forChild(GraphsPage),
  ],
})
export class GraphsPageModule {}
