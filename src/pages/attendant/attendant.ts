import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFirestore } from 'angularfire2/firestore';

@IonicPage()
@Component({
  selector: 'page-attendant',
  templateUrl: 'attendant.html',
})
export class AttendantPage {

  attendant = {};

  constructor(
    private fireStore: AngularFirestore,
    public navCtrl: NavController,
    public navParams: NavParams) {
    const id = navParams.get('id');
    this.loadAttendant(id);
  }

  private loadAttendant(id: string) {
    try {
      const sub = this.fireStore.collection('attendants').doc(id).get().subscribe(attendant => {
        if (attendant.data() !== undefined) {
          const data = attendant.data();
          this.attendant = data;
          this.attendant['image'] = 'https://photos3.fotosearch.com/bthumb/CSP/CSP990/avatar-masked-man-or-alien-stock-illustration__k9886085.jpg';
          if (data.attended) {
            this.showMessage('This person has already been registered');
          } else {
            this.registerAttendance(id);
          }
        } else {
          this.goBackWithError('This person is not registered.');
        }
        sub.unsubscribe();
      });
    } catch (error) {
      console.error(error);
      this.goBackWithError('Invalid QR Code!');
    }
  }

  private showMessage(message: string) {
    alert(message);
  }

  private registerAttendance(id: string) {
    const reference = this.fireStore.firestore.collection('configurations').doc('attendance');
    this.fireStore.collection('attendants').doc(id).update({ attended: true });
    this.fireStore.firestore.runTransaction(transaction => {
      return transaction.get(reference).then(doc => {
        if (!doc.exists) {
          throw "Document does not exist!";
        }
        const attendants = doc.data().attendants + 1;
        transaction.update(reference, { attendants: attendants });
      });
    })
  }

  private goBack() {
    if (this.navCtrl.canGoBack()) {
      this.navCtrl.pop();
    }
  }

  private goBackWithError(error_message: string) {
    this.showMessage(error_message);
    this.goBack();
  }

}
