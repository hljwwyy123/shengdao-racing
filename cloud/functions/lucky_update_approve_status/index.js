const tcb = require('@cloudbase/node-sdk')
const cloud = require('wx-server-sdk')

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
  const { activityId, flag } = event;
  const wxContext = cloud.getWXContext()
  const result = await db.collection('lucky_approve_list')
    .where({
      unionId: wxContext.FROM_UNIONID || wxContext.UNIONID,
      activityId: activityId
    })
    .get();
  const record = result.data;
  if (!record) {
    throw new Error('没有查到记录')
  }
  const remainTimes = record.times;
  await db.collection('lucky_approve_list')
    .where({
      unionId: wxContext.FROM_UNIONID || wxContext.UNIONID,
      activityId: activityId
    })
    .update({
      isPass: flag, 
      times: remainTimes != undefined ? remainTimes : (flag ? 1 : 0)
    })
    
  return result
}