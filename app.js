const vkAPi = require('./vkApi');
const dbService = require('./db/dbSevice');

async function getRecordsChunk({count, offset}){
  let records = await vkAPi.getWallRecords({count, offset});
  return dbService.upsertWallRecords(records.items)
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

async function getWallRecordsTop(count = 10){
  let top = await dbService.getTopWallRecordsBylikes();
  console.log(top.map(r => ({id: r._id, likes: r.likes})));
  process.exit();
}
//getRecords(1000);
getWallRecordsTop();
