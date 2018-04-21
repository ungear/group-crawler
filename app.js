const fbConfig = require('./firebase-config');
const firebase = require("firebase");

firebase.initializeApp(fbConfig);
const database = firebase.database();
database.ref('wallRecords').once('value').then(snapshot => {
  console.log(snapshot.val())
  process.exit()
})