const vkConfig = require('./vk-config');
const https = require('https');

const groupId = vkConfig.vkGroupId;
const accessToken = vkConfig.serviceKey;
const apiVersion = '5.74';
const vkApiRoot = 'https://api.vk.com/method';

exports.getWallRecords = function ({offset = 0, count = 100} = {}) {
  let url = `${vkApiRoot}/wall.get?owner_id=${groupId}&count=${count}&offset=${offset}&v=${apiVersion}&access_token=${accessToken}&extended=1`;

  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => resolve(JSON.parse(responseData).response))
    }).on('error', e => reject(e))
  })
}
