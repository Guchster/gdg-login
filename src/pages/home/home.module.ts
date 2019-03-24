import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { QRScanner } from '@ionic-native/qr-scanner';
import { QrProvider } from '../../providers/qr';
import { DbLoaderProvider } from '../../providers/db-loader';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  providers: [
    DbLoaderProvider,
    QRScanner,
    QrProvider
  ]
})
export class HomePageModule {}
