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
  const { activityId } = event;
  const wxContext = cloud.getWXContext()
  console.log({wxContext})
  const result = await db.collection('lucky_approve_list')
    .where({
      // unionId: wxContext.FROM_UNIONID || wxContext.UNIONID,
      unionId: 'odP016WlTJ69b7Fqp9BfkHD0SX30',
      activityId: activityId
    })
    .get();
  if (result && result.data.length) {
    const data = result.data[0];
    if (data.scoreImage) {
      const tmp = await cloud.getTempFileURL({
        fileList: [data.scoreImage]
      });
      data.scoreImage = tmp.fileList[0].tempFileURL;
    }
    if (data.avatar) {
      const tmp = await cloud.getTempFileURL({
        fileList: [data.avatar]
      });
      data.avatar = tmp.fileList[0].tempFileURL;
    }
  }
  
  return result
}