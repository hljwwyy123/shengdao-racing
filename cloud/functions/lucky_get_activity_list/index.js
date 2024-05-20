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
  // activityStatus 0: 未开始 1：已开始 2：已结束
  list.data.forEach(e => {
    if (moment(e.beginTime).valueOf() > nowDate) {
      e.activityStatus = 0;
    } else if (moment(e.endTime).valueOf() < nowDate) {
      e.activityStatus = 2;
    } else if (moment(e.beginTime).valueOf() < nowDate && moment(e.endTime).valueOf() > nowDate) {
      e.activityStatus = 1;
    }
  })
  return list
}