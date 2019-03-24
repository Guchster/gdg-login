import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QrProvider } from '../../providers/qr';
import { AngularFirestore } from 'angularfire2/firestore';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  isScanningQr = false;
  eventName = '';
  attendants = { inside: 0, outside: 0 };

  constructor(
    private fireStore: AngularFirestore,
    public navCtrl: NavController,
    private qrProvider: QrProvider
  ) {
    this.init();
    setTimeout(() => {
      this.navCtrl.push('AttendantPage', { id: 'santiagommejiagmailcom' });
    }, 1000);
  }

  private init() {
    this.getEventConfigs();
    this.updateAttendance();
  }

  private getEventConfigs() {
    const sub = this.fireStore.collection('configurations').doc('event').get().subscribe(event => {
      const data = event.data();
      this.eventName = data !== undefined ? data.name : '';
      sub.unsubscribe();
    });
  }

  ionViewDidEnter() {
    this.updateAttendance();
  }

  private updateAttendance() {
    const sub = this.fireStore.collection('configurations').doc('attendance').get().subscribe(attendance => {
      if (attendance.data() !== undefined) {
        const data = attendance.data();
        this.attendants = {
          inside: data.attendants,
          outside: data.total - data.attendants
        };
      }
      sub.unsubscribe();
    });
  }

  closeScanner() {
    this.isScanningQr = false;
    this.qrProvider.hideCamera();
  }

  openScanner() {
    this.isScanningQr = true;
    this.qrProvider.qrScan().then(text => {
      this.isScanningQr = false;
      if (text !== '') {
        this.navCtrl.push('AttendantPage', { id: text });
      }
    });
  }

}
