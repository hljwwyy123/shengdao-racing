const tcb = require('@cloudbase/node-sdk')
const cloud = require('wx-server-sdk')

const tcbapp = tcb.init({
    env: 'racing-7gxq1capbac7539a',
    region: "ap-shanghai",
});

cloud.init({
    env: 'racing-7gxq1capbac7539a'
})

const db = tcbapp.database({ throwOnNotFound: false })

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    // 查询 racing-data 表中每个 openId 的最小 single_score，并且返回指定字段
    const result = await db.collection('racing-data')
        .where({
            openId: wxContext.OPENID // 使用传入的 openId 进行查询
        })
        .orderBy('single_score', 'asc') // 按照 single_score 升序排序
        .get();

    if (result.data.length === 0) {
        // 如果未查询到记录，则返回空数据
        return {
            code: 0,
            data: null
        };
    }
    
    // 如果查询到记录，则返回最快成绩信息
    const bestRecord = {
        record: result.data[0],
        totalLapNum: result.data.length
    }
    return {
        code: 0,
        data: bestRecord
    };
}
