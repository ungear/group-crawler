const fbConfig = require('./firebase-config');
const firebase = require("firebase");

firebase.initializeApp(fbConfig);
const database = firebase.database();

// write
let newRecordData = {
  authorId: 1234,
  text: new Date().getTime(),
}
let newKey = database.ref('wallRecords').push().key;
let updates = {};
updates['/wallRecords/' + newKey] = newRecordData;
database.ref().update(updates);

//read
database.ref('wallRecords').once('value').then(snapshot => {
  console.log(snapshot.val())
  process.exit()
})