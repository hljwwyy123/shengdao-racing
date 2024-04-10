const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');
// 定义一个轮询间隔
const POLL_INTERVAL = 5000; // 每5000毫秒（5秒）检查一次

const db = new sqlite3.Database('/Users/joy/Documents/kart-4-3.7.db', (err) => {
  if (err) {
    return console.error(err.message)
  }
  console.log('Connected to the SQLite database')
});


// 函数：发送HTTP请求，并返回Promise
function sendHttpRequest(data) {
  return axios.post('https://racing-7gxq1capbac7539a-1300165852.ap-shanghai.app.tcloudbase.com/postfromlocal', data)
    .then(response => {
      return {
        success: true,
        id: data.id,
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
const checkForNewEvents = () => {
    db.serialize(() => {
        db.all("SELECT * FROM score_log WHERE uploaded = 0", [], (err, rows) => {
            if (err) {
                console.error(err.message);
                return;
            }
            rows.forEach((row) => {
                // 这里的同步逻辑根据具体需求实现
                // 例如发送HTTP请求
                axios.post('https://racing-7gxq1capbac7539a-1300165852.ap-shanghai.app.tcloudbase.com/postdata', {
                  ...row
                })
                .then(response => {
                    // 假设事件处理成功后，更新事件状态
                    db.run("UPDATE score_log SET uploaded = 1 WHERE id = ?", row.id, (updateErr) => {
                        if (updateErr) {
                            console.error(updateErr.message);
                        }
                    });
                })
                .catch(error => {
                    console.error(error);
                });
            });
        });
    });
};



// 开启轮询
setInterval(checkForNewEvents, POLL_INTERVAL);