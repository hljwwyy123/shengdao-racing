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
    const result = await db.collection('racing-data')
      .where({
        lap_create_time: {
            $regex: getTodayDateRegex()
        }
      })
      .get();
    let temp = {};
    const recordList = result.data;
    for (let i = 0; i < recordList.length; i++) {
        temp = recordList[i];
        if (temp.avatar) {
            const result = await cloud.getTempFileURL({
                fileList: [temp.avatar]
            });
            if (result.fileList && result.fileList.length) {
                temp.avatar = result.fileList[0].tempFileURL;
            }
        }
    }
    const rank = groupBy(recordList, 'timer_num');
    return rank
}
// 获取当天日期的正则表达式
function getTodayDateRegex() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;
    return `^${todayString}`;
}

// 根据指定字段对数组进行分组
function groupBy(arr, key) {
    return arr.reduce((acc, obj) => {
        const groupKey = obj[key];
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(obj);
        return acc;
    }, {});
}