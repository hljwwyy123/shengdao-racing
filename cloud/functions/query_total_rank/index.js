const tcb = require('@cloudbase/node-sdk')


const tcbapp = tcb.init({
    env: 'racing-7gxq1capbac7539a',
    region: "ap-shanghai",
});

const db = tcbapp.database({ throwOnNotFound: false })

const _ = db.command;

exports.main = async (event, context) => {
    // 查询 racing-data 表中每个 openId 的最小 single_score，并且返回指定字段
    const result = await db.collection('racing-data')
      .aggregate()
      .match({
        openId: _.exists(true) // openId 不为空的记录
      })
      .group({
        _id: '$openId',
        nick_name: {'$first': '$nickName'}, 
        single_score: {'$min': '$single_score'},
        gender: {'$first': '$gender'}, 
        car_name: {'$first': '$car_name'}, 
        lap_create_time: {'$first': '$car_name'},
        avatar: {'$first': '$avatar'}
      })
      // .project({
      //   _id: 0,
      //   openId: '$_id',
      //   nick_name: 1,
      //   avatar: 1,
      //   single_score: 1
      // })
      .end();

    return result.data
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