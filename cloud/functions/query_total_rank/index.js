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
    const { vehicleType } = event;
    console.log({vehicleType})
    let matchCondition = {
      openId: _.exists(true),
      single_score: _.gt(70000),
      vehicleType: _.eq(vehicleType)
    };
   
    
    const result = await db.collection('racing-data')
      .aggregate()
      .match(matchCondition)
      .sort({'single_score': -1})
      .group({
        _id: '$openId', 
        min_single_score: {"$min": "$single_score"}
      })
      .limit(500)
      .end();
    // 查询对应的记录
    const data = await Promise.all(result.data.map(async item => {
      const record = await db.collection('racing-data')
        .where({
          openId: db.command.eq(item._id), // 使用当前 _id 即 openId 进行查询
          single_score: db.command.eq(item.min_single_score), // 最小 single_score 对应的记录
          
        })
        .limit(1) // 只查询一条记录
        .get();

      let avatarUrl = "";
      if (record.data[0].avatar) {
        const result = await cloud.getTempFileURL({
          fileList: [record.data[0].avatar]
        });
        if (result.fileList && result.fileList.length) {
          avatarUrl = result.fileList[0].tempFileURL;
        }
      }
      
      return {
        openId: item._id,
        single_score: item.min_single_score,
        nick_name: record.data[0].nickName,
        carName: record.data[0].carName,
        avatar: avatarUrl,
        gender: record.data[0].gender,
        lap_create_time: record.data[0].lap_create_time,
      };
    }));

    data.sort((a, b) => a.single_score - b.single_score )
    
    return data
}
