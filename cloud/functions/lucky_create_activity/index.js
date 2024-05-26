const tcb = require('@cloudbase/node-sdk')
const cloud = require('wx-server-sdk')
const moment = require('moment');

cloud.init({
  env: 'racing-7gxq1capbac7539a'
})

const tcbapp = tcb.init({
  env: 'racing-7gxq1capbac7539a',
  region: "ap-shanghai",
});

const db = tcbapp.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { id } = event;
  const payload = {
    ...event, 
    unionId: wxContext.FROM_UNIONID, 
    createTime: moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss"),
    awardConfig: [],
  };
  if (id) {
    const res = db.collection('lucky_activity_list').where({_id: id}).update(payload)
    if (res) {
      return { id: id }
    }
    return { id: id }
  } else {
    return db.collection('lucky_activity_list').add(payload)
  }
}