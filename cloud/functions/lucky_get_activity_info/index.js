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
  const data = await db.collection('lucky_activity_list')
    .where({
      _id: event.id
    })
    .get();
  await Promise.all(data.data.map(async el => {
    if (el.bannerImage) {
      const tmp = await cloud.getTempFileURL({
        fileList: [el.bannerImage]
      });
      if (tmp.fileList && tmp.fileList.length) {
        el.bannerImage = tmp.fileList[0].tempFileURL;
      }
    }
  }))
  
  return data
}