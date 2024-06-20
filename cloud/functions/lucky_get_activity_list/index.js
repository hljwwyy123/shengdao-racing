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
  const list = await db.collection('lucky_activity_list')
    .orderBy('createTime', 'desc')
    .get();
  const nowDate = new Date().getTime();
  await Promise.all(list.data.map(async el => {
    if (moment(el.beginTime).valueOf() > nowDate) {
      el.activityStatus = 0;
    } else if (moment(el.endTime).valueOf() < nowDate) {
      el.activityStatus = 2;
    } else if (moment(el.beginTime).valueOf() < nowDate && moment(el.endTime).valueOf() > nowDate) {
      el.activityStatus = 1;
    }
    if (el.bannerImage) {
      const tmp = await cloud.getTempFileURL({
        fileList: [el.bannerImage]
      });
      if (tmp.fileList && tmp.fileList.length) {
        el.bannerImage = tmp.fileList[0].tempFileURL;
      }
    }
  }))
  return list
}