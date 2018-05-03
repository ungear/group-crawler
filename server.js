const express = require('express');
const dbService = require('./db/dbSevice');
const app = express()

app.get('/api/getTopRecordsByLikes', async function (req, res) {
  let data = await dbService.getTopWallRecordsByLikes();
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(JSON.stringify(data))
})
app.get('/api/getTopRecordsByReposts', async function (req, res) {
  let data = await dbService.getTopWallRecordsByReposts();
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(JSON.stringify(data))
})

const port = 3008;
app.listen(port, () =>{ console.log("Started at port " + port)})