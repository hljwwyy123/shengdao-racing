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
  const { id, activityId } = event;
  let res = null;
  if (id) {
    res = await db.collection('lucky_award_config')
    .where({_id: id, activityId: activityId})
    .remove()
  } else {
    res.errorMsg = "找不到奖品"
  }
  return res
}