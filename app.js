const fbConfig = require('./firebase-config');
const firebase = require("firebase");
const vkAPi = require('./vkApi');

firebase.initializeApp(fbConfig);
const database = firebase.database();

async function getRecordsChunk({count, offset}){
  let records = await vkAPi.getWallRecords({count, offset});
  let updates = {};
  records.items.forEach(r => {
    let dbRecord = {
      comments: r.comments.count,
      date: r.date,
      likes: r.likes.count,
      reposts: r.reposts.count,
      text: r.text
    };
    if(r.signer_id) dbRecord.signerId = r.signer_id;
    updates['/wallRecords/' + r.id] = dbRecord;
  });
  return database.ref().update(updates);
}

async function getRecords(number){
  let recordsReceived = 0;
  let offset = 0;
  while (recordsReceived < number){
    await getRecordsChunk({count: 100, offset: offset});
    offset += 100;
    recordsReceived += 100;
    console.log(`Got records: ${recordsReceived}, offset: ${offset}`)
  }
  process.exit();
}

getRecords(10000);


// // write
// let newRecordData = {
//   authorId: 1234,
//   text: new Date().getTime(),
// }
// // let newKey = database.ref('wallRecords').push().key;
// let updates = {};
// updates['/wallRecords/' + 33] = newRecordData;
// database.ref().update(updates);

// //read
// database.ref('wallRecords').once('value').then(snapshot => {
//   console.log(snapshot.val())
//   process.exit()
// })