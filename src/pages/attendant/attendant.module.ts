import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AttendantPage } from './attendant';

@NgModule({
  declarations: [
    AttendantPage,
  ],
  imports: [
    IonicPageModule.forChild(AttendantPage),
  ],
})
export class AttendantPageModule {}
