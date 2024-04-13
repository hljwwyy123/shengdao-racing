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

// 将毫秒转换成分钟和秒的形式
function formatMilliseconds(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const remainingMilliseconds = milliseconds % 1000;

    let result = '';

    if (hours > 0) {
        result += `${hours}h`;
    }

    if (minutes > 0) {
        result += `${minutes}'`;
    }

    result += `${seconds}.${remainingMilliseconds.toString().padStart(3, '0')}`;

    return result;
}

exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const historyResult = await db.collection('racing-data')
        .where({
            openId: _.eq(wxContext.OPENID)
        })
        .get();
    const groupedData = {};
    historyResult.data.forEach(item => {
        const date = item.lap_create_time.substring(0, 10); // 提取日期部分
        if (!groupedData[date]) {
            groupedData[date] = {
                list: [],
                best: {}
            };
        }
        groupedData[date]['list'].push({
            single_score: item.single_score,
            nick_name: item.nick_name,
            avatar: item.avatar,
            lap_create_time: item.lap_create_time
        })
    });
    const historyList = [];
    for (const _date in groupedData) {
        const records = groupedData[_date]['list'];
        // 按 lap_create_time 进行倒序排序
        records.sort((a, b) => new Date(b.lap_create_time.replace(/-/g, '/')).getTime() - new Date(a.lap_create_time.replace(/-/g, '/')).getTime());
        const bestRecord = records.slice().sort((a, b) => a.single_score - b.single_score)[0];
        bestRecord['date'] = _date;
        const formattedRecords = records.map(record => {
            record.lapTime = formatMilliseconds(record.single_score);
            record.lap_create_time_hour = moment(record.lap_create_time).format('HH:mm:ss')
            return record;
        });
        // groupedData[_date]['best'] = bestRecord;
        // groupedData[_date]['list'] = formattedRecords;
        historyList.push({
            best: bestRecord,
            list: formattedRecords
        })
    }
    return historyList
}
