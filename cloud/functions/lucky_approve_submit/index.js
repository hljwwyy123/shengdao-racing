const tcb = require('@cloudbase/node-sdk')
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'racing-7gxq1capbac7539a'
})

const tcbapp = tcb.init({
  env: 'racing-7gxq1capbac7539a',
  region: "ap-shanghai",
});

const db = tcbapp.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  const { activityId, payload } = event;
  const wxContext = cloud.getWXContext()
  const unionId = wxContext.FROM_UNIONID || wxContext.UNIONID;
  const result = await db.collection('lucky_approve_list')
    .where({
      unionId: unionId,
      activityId: activityId
    })
    .get();
  if (result.data.length) {
    await db.collection('lucky_approve_list')
      .where({
        unionId: unionId,
        activityId: activityId
      })
      .update({
        ...payload,
        isPass: _.remove()
      });
    
  } else {
    const randomSeed = fromCode(payload.randomSeed)
    await db.collection('lucky_approve_list')
      .add({activityId: activityId, ...payload, unionId: unionId, randomSeed})
  }
  return result
}

// 字符串解密
function fromCode (str) {
  //定义密钥，36个字母和数字
  var key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var len = key.length;  //获取密钥的长度
  var b, b1, b2, b3, d = 0, s;  //定义临时变量
  s = new Array(Math.floor(str.length / 3));  //计算加密字符串包含的字符数，并定义数组
  b = s.length;  //获取数组的长度
  for (var i = 0; i < b; i ++) {  //以数组的长度循环次数，遍历加密字符串
      b1 = key.indexOf(str.charAt(d));  //截取周期内第一个字符串，计算在密钥中的下标值
      d ++;
      b2 = key.indexOf(str.charAt(d));  //截取周期内第二个字符串，计算在密钥中的下标值
      d ++;
      b3 = key.indexOf(str.charAt(d));  //截取周期内第三个字符串，计算在密钥中的下标值
      d ++;
      s[i] = b1 * len * len + b2 * len + b3  //利用下标值，反推被加密字符的Unicode编码值
  }
  b = eval("String.fromCharCode(" + s.join(',') + ")");  // 用fromCharCode()算出字符串
  return b ;  //返回被解密的字符串
}

// 字符串加密
function toCode (str) {  //加密字符串
  //定义密钥，36个字母和数字
  var key = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var len = key.length;  //获取密钥的长度
  var a = key.split("");  //把密钥字符串转换为字符数组
  var s = "",b, b1, b2, b3;  //定义临时变量
  for (var i = 0; i <str.length; i ++) {  //遍历字符串
      b = str.charCodeAt(i);  //逐个提取每个字符，并获取Unicode编码值
      b1 = b % len;  //求Unicode编码值得余数
      b = (b - b1) / len;  //求最大倍数
      b2 = b % len;  //求最大倍数的于是
      b = (b - b2) / len;  //求最大倍数
      b3 = b % len;  //求最大倍数的余数
      s += a[b3] + a[b2] + a[b1];  //根据余数值映射到密钥中对应下标位置的字符
  }
  return s;  //返回这些映射的字符
}