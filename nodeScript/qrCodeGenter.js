const axios = require('axios');
const fs = require('fs');

// 注意：为确保安全，不要在客户端暴露appsecret
const appid = 'wx98786041f7a0b60d';
const appsecret = 'b9710eae685a8c6a87782635ec366282';
// 计时器号码
const TIMER_CODE_LIST = [
    "1号",
    "2号",
    "3号",
    "4号",
    "5号",
    "6号",
    "7号",
    "8号",
    "9号",
    "10号",
    "11号",
    "12号",
    "13号",
    "14号",
    "15号",
    "16号",
    "17号",
    "18号",
    "19号",
    "20号",
    "GTMAX 01",
    "GTMAX 02",
    "GTMAX 03",
    "GTMAX 04",
    "GTMAX 05",
    "GTMAX 06",
    "GTMAX 07",
    "GTMAX 08",
    "GTMAX 09",
    "GTMAX 10",
    "GTMAX 11",
    "GTMAX 12",
    "21号",
    "22号",
    "23号",
    "24号",
    "25号",
    "26号",
    "27号",
    "28号",
    "30号",
    "31号",
    "32号",
    "33号",
    "34号",
    "35号",
    "36号",
    "37号",
    "38号",
    "39号"];
const path = 'pages/scanQRCode/index?timer=';  // 你希望二维码扫描后跳转的页面路径和参数

async function getAccessToken() {
    const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`);
    return response.data.access_token;
}

async function createQRCode(accessToken, timerCode = '') {
    const response = await axios({
        method: 'post',
        url: `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${accessToken}`,
        data: {
            path: path + timerCode ,
            width: 430
        },
        responseType: 'arraybuffer' // 表明返回服务器响应的数据类型
    });

    // 将二维码图片保存到本地文件系统
    fs.writeFileSync(`${timerCode}.jpg`, response.data);
    console.log('二维码已成功保存到本地');
}

(async () => {
    try {
        const accessToken = await getAccessToken();
        for (let i =0; i < TIMER_CODE_LIST.length; i++) {
            await createQRCode(accessToken, TIMER_CODE_LIST[i]);
        }
    } catch (error) {
        console.error('生成二维码失败：', error);
    }
})();