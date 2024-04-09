const axios = require('axios');
const fs = require('fs');

// 注意：为确保安全，不要在客户端暴露appsecret
const appid = 'wx98786041f7a0b60d';
const appsecret = 'b9710eae685a8c6a87782635ec366282';
const path = 'pages/scanQRCode/index?timer=26&timerId=xxx';  // 你希望二维码扫描后跳转的页面路径和参数

async function getAccessToken() {
    const response = await axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`);
    return response.data.access_token;
}

async function createQRCode(accessToken) {
    const response = await axios({
        method: 'post',
        url: `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${accessToken}`,
        data: {
            path: path,
            width: 430
        },
        responseType: 'arraybuffer' // 表明返回服务器响应的数据类型
    });

    // 将二维码图片保存到本地文件系统
    fs.writeFileSync('qrcode-26.jpg', response.data);
    console.log('二维码已成功保存到本地');
}

(async () => {
    try {
        const accessToken = await getAccessToken();
        await createQRCode(accessToken);
    } catch (error) {
        console.error('生成二维码失败：', error);
    }
})();