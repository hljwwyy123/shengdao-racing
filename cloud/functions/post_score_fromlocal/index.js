const tcb = require('@cloudbase/node-sdk')


const tcbapp = tcb.init({
  env: 'racing-7gxq1capbac7539a',
  region: "ap-shanghai",
});

const db = tcbapp.database({throwOnNotFound: false})

const _ = db.command;
async function combineData(postData) {
    const payloadList = [];
    for (let i = 0; i < postData.length; i++) {
        const el = postData[i];
        const bindRecord = await db.collection('openid_union_timer').where({//对数据集进行where条件筛选
            timerCode:_.eq(el.car_name)
        }).get();
        if (bindRecord.data && bindRecord.data.length) {
            const {avatar, nickName, openId, gender} = bindRecord.data[0]
            const record = {
                "lap_create_time": el.lap_create_time,
                "single_score": el.single_score,
                "timer_num": el.car_name,
                "avatar": avatar,
                "nickName": nickName,
                "openId": openId,
                "gender": gender,
            }
            payloadList.push(record)
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
