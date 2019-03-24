# gdg-login
This Ionic app allows you to read a QR Code to get the information of a person who is attending to an event at registration time.
A Firestore database is built with the information of all the attendants, this information is gathered from a .csv file containing all the responses from a Google Form.


### Setup

Open your terminal.
1. Clone this project `git clone https://github.com/Guchster/gdg-login.git`.
2. Go to your project folder `cd gdg-login`.
3. Install dependencies with `npm i` (in macOS you may need to add the `--unsafe-perm=true` flag). 
4. Add a platform `ionic cordova platform add android` and connect an android device.
5. Run the project in the device `ionic cordova run android`.

### Add Your Firestore Credentials

You can check out this great Ionic Firestore [tutorial here.](https://blog.ionicframework.com/building-ionic-apps-with-firestore/)

Create a file `src/app/credentials.ts` and populate it with your project's credentials.
```Typescript
export const firebaseConfig = {
  apiKey: 'Your Firebase Credentials Here',
  authDomain: 'Your Firebase Credentials Here',
  databaseURL: 'Your Firebase Credentials Here',
  projectId: 'Your Firebase Credentials Here',
  storageBucket: 'Your Firebase Credentials Here',
  messagingSenderId: 'Your Firebase Credentials Here'
};
```

### Define your custom parser for .csv file

You can populate your own database with the data from the responses of a Google Form.
In order to do this there are a couple of things to do.

1. Add your JSON database
* Go to your Google Form and download the responses as .csv
* Go to [this page](http://www.convertcsv.com/csv-to-json.htm) and convert your .csv file to a JSON array (CSV to JSON array).
* Go to `src/providers/csv-database.ts` and paste the JSON.

2. Define your custom formKeyParser
* Go to `src/providers/db-loader.ts`.
* Define the keys of formKeyParser **exactly** as the keys from the JSON database at `src/providers/csv-database.ts`.
* Define the values of formKeyParser as the attribute name you want to refer to.

3. Add aditional document attributes (optional)
* If you want to add additional attributes to each object, you can add them at parsing time like this:
  `person['some_key'] = 'some_value';`

### Populate your database
Go to `src/app/app.component.ts` and remove the comment line `this.dbLoader.loadDatabase();`, this will load all the content from your `csv-database.ts` file to firestore.
Remember that this action will overwrite all your previous firestore documents for each object in the JSON database, you can avoid this by changing the document id you refer to when saving the collection in the `src/providers/db-loader.ts` file.

### QR Code Generation
At the time the QR Code generation is done manually using [this page](https://www.qr-code-generator.com/).
The text you have to convert to QR Code should be the **personKey** generated at the `src/providers/db-loader.ts` file for each object of the collection.
If the QR Code does not contain this **personKey** the entry will not be found at the Firestore collection, as it is stored with this key.

## Contact
If you have questions or comments, add them to Issues section of this repository.

If you have improvements generate a pull request.
