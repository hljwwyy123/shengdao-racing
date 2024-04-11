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
        openId: _.exists(true),
      })
      .group({
        _id: '$openId',
        min_single_score: {"$min": "$single_score"}
      })
      .end();
    // 查询对应的记录
    const data = await Promise.all(result.data.map(async item => {
      const record = await db.collection('racing-data')
        .where({
          openId: db.command.eq(item._id), // 使用当前 _id 即 openId 进行查询
          single_score: db.command.eq(item.min_single_score) // 最小 single_score 对应的记录
        })
        .limit(1) // 只查询一条记录
        .get();

      return {
        openId: item._id,
        single_score: item.min_single_score,
        nick_name: record.data[0].nickName,
        car_name: record.data[0].car_name,
        avatar: record.data[0].avatar,
        gender: record.data[0].gender,
        lap_create_time: record.data[0].lap_create_time,
      };
    }));

    return data
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