import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { csv } from './csv-database';

@Injectable()
export class DbLoaderProvider {

  constructor(private fireStore: AngularFirestore) { }

  public loadDatabase() {
    const assistants: Map<string, any> = this.getAssistantsFromCSV(csv);
    this.populateBulkDatabase(assistants);
    this.addConfigurations(assistants.size);
  }

  populateBulkDatabase(assistants: Map<string, any>) {
    assistants.forEach((value, key) => {
      this.fireStore.collection('attendants').doc(key).set(value);
    });
  }

  addConfigurations(assistantsCount: number) {
    const attendance = { total: assistantsCount, attendants: 0 };
    const event = { name: 'IWD 2019', location: 'Jalasoft' };
    this.fireStore.collection('configurations').doc('attendance').set(attendance);
    this.fireStore.collection('configurations').doc('event').set(event);
  }

  private getAssistantsFromCSV(csv): Map<string, any> {
    const map = new Map<string, any>();
    csv.forEach(csvPerson => {
      const person = {};
      formKeyParser.forEach((parseData: [string, string]) => {
        const value = parseData[0];
        const key = parseData[1];
        person[key] = csvPerson[value];
      });
      person['attended'] = false;
      const personKey = this.getEmailAsKey(person['email']);
      map.set(personKey, person);
    });
    return map;
  }

  private getEmailAsKey(email: string): string {
    return email.replace(/@/g, '').replace(/\./g, '');
  }

}

// Keys from the google forms generated .csv, translated to custom model keys
const formKeyParser = [
  ['Marca temporal', 'registrationTime'],
  ['Nombre de usuario', 'email'],
  ['Nombre completo', 'fullName'],
  ['Ocupación', 'occupation'],
  ['Describe la(s) área(s) en las que te desempeñas', 'description'],
  ['Número de celular', 'cellphone'],
  ['Tipo de entrada', 'ticketType'],
  ['Foto de comprobante de depósito', 'paymentPhoto'],
  ['¿Observaciones?', 'notes']
];
