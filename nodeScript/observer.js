/**
 * 本地node服务，定时轮询 score_log ，把uploaded为0的数据 http post到云函数
 * 一次调用，批量上传多条数据
 */
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
const CLOUD_FUNCTION_HTTPPATH = 'postfromlocal'
// 定义一个轮询间隔
const POLL_INTERVAL = 1000 * 60; // 每5000毫秒（5秒）检查一次
const DB_PATH = '/Users/aiden/code/db/kart.db';
// const DB_PATH = '/Users/joy/Documents/kart-4-3.7.db'

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    return console.error(err.message)
  }
  console.log('Connected to the SQLite database')
});


// 函数：处理score_log中所有记录的上传和删除
function processScoreLogs() {
  db.all("SELECT * FROM score_log WHERE uploaded = 0", [], async (selectErr, rows) => {
    if (selectErr) {
      console.error('Error selecting from score_log', selectErr);
      return;
    }
    if (rows.length) {
      // 为所有行发送HTTP请求，处理为Promise数组
      await sendHttpRequest(rows);
      console.log(`上传${rows.length}数据成功`)
      // 筛选出成功上传的记录ID
      const idsToUpdate = rows.map(result => result.id);
      db.run(`UPDATE score_log SET uploaded = 1 WHERE id IN (${idsToUpdate.map(() => '?').join(',')})`, idsToUpdate, function(deleteErr) {
        if (deleteErr) {
          console.error('Error update records', deleteErr);
        } else {
          console.log(`Successfully update ${this.changes} records.`);
        }
      });
    }
  });
}

// 函数：发送HTTP请求，并返回Promise
function sendHttpRequest(data) {
  return axios.post(`https://racing-7gxq1capbac7539a-1300165852.ap-shanghai.app.tcloudbase.com/${CLOUD_FUNCTION_HTTPPATH}`, data, {
    Headers: {
      'Content-type': 'application/json'
    }
  })
    .then(response => {
      // 请求成功，返回响应
      return {
        success: true,
        id: data.id,
        response: response.data
      };
    })
    .catch(error => {
      // 请求失败，返回错误
      return {
        success: false,
        id: data.id,
        error: error
      };
    });
}


// 开启轮询
setInterval(processScoreLogs, POLL_INTERVAL);
