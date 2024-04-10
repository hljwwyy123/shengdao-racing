const tcb = require('@cloudbase/node-sdk')


const tcbapp = tcb.init({
    env: 'racing-7gxq1capbac7539a',
    region: "ap-shanghai",
});

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
    const rank = groupBy(result.data, 'timer_num');
    console.log(rank)
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