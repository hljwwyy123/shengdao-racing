const tcb = require('@cloudbase/node-sdk')
const cloud = require('wx-server-sdk')

const tcbapp = tcb.init({
    env: 'racing-7gxq1capbac7539a',
    region: "ap-shanghai",
});

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: 'racing-7gxq1capbac7539a'
})

const db = tcbapp.database({ throwOnNotFound: false })

const _ = db.command;

exports.main = async (event, context) => {
  const result = await db.collection('group_list')
    .get();

  return result;
}