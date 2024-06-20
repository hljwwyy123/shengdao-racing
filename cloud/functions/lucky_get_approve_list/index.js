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
  const result = await db.collection('lucky_approve_list')
    .where({
      // unionId: wxContext.FROM_UNIONID || wxContext.UNIONID,
      activityId: activityId
    })
    .orderBy('score', 'asc') // 按照 single_score 升序排序
    .get();

    await Promise.all(result.data.map(async el => {
      if (el.avatar) {
        const tmp = await cloud.getTempFileURL({
          fileList: [el.avatar]
        });
        if (tmp.fileList && tmp.fileList.length) {
          el.avatar = tmp.fileList[0].tempFileURL;
        }
      }
      if (el.scoreImage) {
        const tmp = await cloud.getTempFileURL({
          fileList: [el.scoreImage]
        });
        if (tmp.fileList && tmp.fileList.length) {
          el.scoreImage = tmp.fileList[0].tempFileURL;
        }
      }
    }))
  
  return result
}