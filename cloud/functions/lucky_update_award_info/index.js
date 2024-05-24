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
  const { id, prizeInfo, activityId } = event;
  let res = null;
  if (id) {
    res = await db.collection('lucky_award_config')
    .where({_id: id})
    .update({...prizeInfo});
  } else {
    res =await db.collection('lucky_award_config')
      .add({activityId: activityId, ...prizeInfo})
  }
  return res
}