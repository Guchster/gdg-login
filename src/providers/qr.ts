import { QRScannerStatus } from '@ionic-native/qr-scanner';
import { QRScanner } from '@ionic-native/qr-scanner';
import { Injectable } from '@angular/core';

@Injectable()
export class QrProvider {

  isActiveQRScanner = false;

  constructor(private qrScanner: QRScanner) {
    this.initQRScanner();
  }
  
  private initQRScanner() {
    this.qrScanner.hide();
    this.hideCamera();
   }

  public qrScan(): Promise<string> {
    return new Promise<string>(resolve => {
      this.showCamera();
      this.qrScanner.prepare().then((status: QRScannerStatus) => {
        if (status.authorized) {
          this.isActiveQRScanner = true;
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
              this.qrScanner.hide();
              scanSub.unsubscribe();
              this.hideCamera();
              resolve(text);
            });
            // turn off automatically after 10 seconds
            setTimeout(() => {
              if (this.isActiveQRScanner) {
                this.qrScanner.hide();
                scanSub.unsubscribe();
                this.hideCamera();
              }
              resolve('');
            }, 10000);
          } else if (status.denied) {
            resolve('');
            const enablePermission = confirm('Enable camera permission to scan the QR code.');
            if(enablePermission) {
              this.qrScanner.openSettings();
            }
            this.hideCamera();
          } else {
            resolve('');
          }
        }).catch(() => resolve(''));
    });
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  public hideCamera() {
    this.isActiveQRScanner = false;
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

}
