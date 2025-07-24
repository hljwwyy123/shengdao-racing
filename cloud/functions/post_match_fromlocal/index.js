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
  try {
    let postData = []
    if (typeof event.body === 'object') { // 模拟器提交的是对象
      postData = event.body;
    } else {   // HTTP 接口调用提交的是 json string
      postData = JSON.parse(event.body);
    }

    console.log('上行数据====', postData)
    const result = await db.collection('gameList')
      .add(postData);
    return result
  } catch (e) {
    console.error(e)
  }
}