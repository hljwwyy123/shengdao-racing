const tcb = require('@cloudbase/node-sdk')
const cloud = require('wx-server-sdk')

const tcbapp = tcb.init({
    env: 'racing-7gxq1capbac7539a',
    region: "ap-shanghai",
});

// 初始化 cloud
cloud.init({
    env: 'racing-7gxq1capbac7539a'
})

const db = tcbapp.database({ throwOnNotFound: false })
const _ = db.command;

/**
 * 圈速赛（match_type=1）：每个车手（openId）取最快圈速（single_score最小），按最快圈速升序排名
 * 排位赛（match_type=2）：每个车手（openId）取所有圈速的总成绩（single_score求和），按总成绩升序排名
 */
exports.main = async (event, context) => {
    const { match_seq, match_type } = event;
    // 查询所有该比赛的成绩
    const result = await db.collection('racing-data')
        .where({
            match_seq: _.eq(match_seq)
        })
        .limit(400)
        .get();

    let recordList = result.data || [];
    // 过滤掉异常成绩
    recordList = recordList.filter(e => e.single_score > 70000 && e.single_score < 1700000);

    // 按openId分组
    const groupByOpenId = (arr) => {
        const map = {};
        arr.forEach(item => {
            if (!item.openId) return;
            if (!map[item.openId]) map[item.openId] = [];
            map[item.openId].push(item);
        });
        return map;
    };

    const grouped = groupByOpenId(recordList);

    let rankList = [];

    if (String(match_type) == '1') {
        // 圈速赛：每个车手取最快圈速
        for (const openId in grouped) {
            const userRecords = grouped[openId];
            // 取最快圈速
            let best = userRecords.reduce((min, cur) => cur.single_score < min.single_score ? cur : min, userRecords[0]);
            // 统计总圈数
            let totalLap = userRecords.length;
            // 组装返回
            rankList.push({
                ...best,
                totalLap,
                allLaps: userRecords, // 可选：返回所有圈速
            });
        }
        // 按最快圈速升序
        rankList.sort((a, b) => a.single_score - b.single_score);
    } else if (String(match_type) === '2') {
        // 排位赛：每个车手取所有圈速的总成绩
        for (const openId in grouped) {
            const userRecords = grouped[openId];
            // 总成绩
            let totalScore = userRecords.reduce((sum, cur) => sum + (cur.single_score || 0), 0);
            // 取第一个圈速为代表
            let rep = userRecords[0];
            let totalLap = userRecords.length;
            rankList.push({
                ...rep,
                totalLap,
                totalScore,
                allLaps: userRecords, // 可选：返回所有圈速
            });
        }
        // 按总成绩升序
        rankList.sort((a, b) => a.totalScore - b.totalScore);
    } else {
        // 未知类型，直接返回全部
        rankList = recordList;
    }

    // 返回排名列表
    return rankList;
}