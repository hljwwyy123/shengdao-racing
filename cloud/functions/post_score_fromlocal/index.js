const tcb = require('@cloudbase/node-sdk')


const tcbapp = tcb.init({
  env: 'racing-7gxq1capbac7539a',
  region: "ap-shanghai",
});

const db = tcbapp.database({throwOnNotFound: false})

const _ = db.command;

// 获取当天日期的正则表达式
function getTodayDateRegex() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const todayString = `${year}-${month}-${day}`;
    return `^${todayString}`;
}

async function combineData(postData) {
    const payloadList = [];
    for (let i = 0; i < postData.length; i++) {
        const el = postData[i];
        // 查询今天绑定了计时器的微信用户数据，如果当天微信没绑定计时器，就只记录计时器卡号，用于查询实时榜单用
        const bindRecord = await db.collection('openid_union_timer').where({
            timerCode:_.eq(el.car_name),
            bindTime: {
                $regex: getTodayDateRegex()
            }
        })
        .orderBy('bindTime', 'desc') // 查询最新绑定记录，一个计时器当前可能被多个人绑定多次
        .get();
        const originData = {
            "lap_create_time": el.lap_create_time,
            "single_score": el.single_score,
            "timer_num": el.car_name,
        }
        if (bindRecord.data && bindRecord.data.length) {
            const {avatar, nickName, openId, gender} = bindRecord.data[0]
            const record = {
                ...originData,
                "avatar": avatar,
                "nickName": nickName,
                "openId": openId,
                "gender": gender,
            }
            payloadList.push(record)
        } else {
            payloadList.push(originData)
        }
    }
    
    return payloadList;
}
exports.main = async (event, context) => {
    try {
        let postData = []
        if (typeof event.body === 'object'){ // 模拟器提交的是对象
          postData = event.body;
        } else {   // HTTP 接口调用提交的是 json string
          postData = JSON.parse(event.body);          
        }
        const payloadList = await combineData(postData);
        await db.collection('racing-data').add(payloadList)
        return payloadList
    } catch (e) {
        console.error(e)
    }
};
