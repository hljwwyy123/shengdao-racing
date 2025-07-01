const tcb = require('@cloudbase/node-sdk')
const cloud = require('wx-server-sdk')
const moment = require('moment');

cloud.init({
  env: 'racing-7gxq1capbac7539a'
})

const tcbapp = tcb.init({
  env: 'racing-7gxq1capbac7539a',
  region: "ap-shanghai",
});

const db = tcbapp.database()
const BATCH_SIZE = 100

// 云函数入口函数
exports.main = async (event, context) => {
 
  
  const updateResult = await db.collection('racing-data')
  .where({openId: 'oK8-I5Qg-aRcjVCefUDbjAfsgt7k'})
  .options({ multiple: true })
  .update({
    vehicleType: 'car'
  });
  
  console.log('Updated', updateResult.modifiedCount, 'documents');

  return updateResult
}