const tcb = require('@cloudbase/node-sdk')
const moment = require('moment');

const tcbapp = tcb.init({
  env: 'racing-7gxq1capbac7539a',
  region: "ap-shanghai",
});

const db = tcbapp.database()

exports.main = async (event, context) => {
    const userInfo = {...event.userInfo};
    delete event.userInfo;
    const payload = {...event, ...userInfo, bindTime: moment(new Date().getTime()).format("YYYY-MM-DD HH:mm:ss")};
    await db.collection('openid_union_timer').add(payload)
    return payload
};
