const tcb = require('@cloudbase/node-sdk')
const cloud = require('wx-server-sdk')
const moment = require('moment');

const tcbapp = tcb.init({
    env: 'racing-7gxq1capbac7539a',
    region: "ap-shanghai",
});

cloud.init({
    env: 'racing-7gxq1capbac7539a'
})

const db = tcbapp.database({ throwOnNotFound: false })
const _ = db.command;


exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const bestScore = await db.collection('racing-data')
        .where({
            openId: wxContext.OPENID // 使用传入的 openId 进行查询
        })
        .orderBy('single_score', 'asc') // 按照 single_score 升序排序
        .get();

    if (bestScore.data.length === 0) {
        // 如果未查询到记录，则返回空数据
        return {
            code: 0,
            data: null
        };
    }
    // 如果查询到记录，则返回最快成绩信息
    const bestRecord = {
        record: bestScore.data[0],
        totalLapNum: bestScore.data.length
    }

    return {
        code: 0,
        data: bestRecord
    };
}
