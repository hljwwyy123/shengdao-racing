const tcb = require('@cloudbase/node-sdk')
const cloud = require('wx-server-sdk')
const moment = require('moment')

cloud.init({
  env: 'racing-7gxq1capbac7539a'
})

const tcbapp = tcb.init({
  env: 'racing-7gxq1capbac7539a',
  region: "ap-shanghai",
});

const db = tcbapp.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const { activityId } = event;
  const result = await db.collection('lucky_award_config')
    .where({activityId: activityId})
    .get();
  await Promise.all(result.data.map(async el => {
    if (el.prizeImage) {
      const tmp = await cloud.getTempFileURL({
        fileList: [el.prizeImage]
      });
      if (tmp.fileList && tmp.fileList.length) {
        el.prizeImage = tmp.fileList[0].tempFileURL;
      }
    }
  }))
  
  return result
}