const vkConfig = require('./vk-config');
const https = require('https');

const groupId = vkConfig.vkGroupId;
const accessToken = vkConfig.serviceKey;
const vkApiRoot = 'https://api.vk.com/method';

exports.getWallRecords = function ({offset = 0, count = 100} = {}) {
  let url = `${vkApiRoot}/wall.get?owner_id=${groupId}&count=${count}&offset=${offset}&v=5.62&&access_token=${accessToken}`;

  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => resolve(JSON.parse(responseData).response))
    })
  })
}
