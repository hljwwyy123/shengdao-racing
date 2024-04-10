const axios = require('axios')
const CLOUD_FUNCTION_HTTPPATH = 'postfromlocal'
// const CLOUD_FUNCTION_HTTPPATH = 'postdata'
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

  sendHttpRequest([
    {
      "car_name":"26号",
      "dateTime":1712136373670,
      "lap_create_time": "2024-04-10 20:26:08",
      "single_score": 13333,
    },
    {
      "car_name":"26号",
      "dateTime":1712136373670,
      "lap_create_time": "2024-04-10 20:26:08",
      "single_score": 15555,
    },
  ])