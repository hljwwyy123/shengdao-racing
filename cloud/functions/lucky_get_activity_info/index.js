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
  console.log(event)
  const data = await db.collection('lucky_activity_list')
    .where({
      _id: event.id
    })
    .get();
  
  return data
}