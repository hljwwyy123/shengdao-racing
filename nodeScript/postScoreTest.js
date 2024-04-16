const axios = require('axios')
const moment = require('moment')
const CLOUD_FUNCTION_HTTPPATH = 'postfromlocal'
// const CLOUD_FUNCTION_HTTPPATH = 'postdata'

/**
 * 模拟本地node服务查询本地 score_log 表中未上传的数据提交到云函数
 * 根据上行数据中 car_name 匹配到当天绑定微信的中间表
 * 把微信用户信息和 car_name ，圈速数据写入 racing-data表中
 * @param {*} data 
 * @returns 
 */
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

  (async function() {
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const res = await sendHttpRequest([
      {
        "car_name":"25号",
        "dateTime":1712136373670,
        "lap_create_time": currentTime,
        "single_score": 86790,
      },
      {
        "car_name":"24号",
        "dateTime":1712136373670,
        "lap_create_time": currentTime,
        "single_score": 86900,
      },
    ]);
    console.log('上报成功：',res)
  })()
