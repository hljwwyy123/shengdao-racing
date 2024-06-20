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

// 核心抽奖函数
exports.main = async (event, context) => {
  const { activityId } = event;
  const wxContext = cloud.getWXContext()
  const unionId = wxContext.FROM_UNIONID || wxContext.UNIONID;
  const openId = wxContext.FROM_OPENID || wxContext.OPENID;
  // 获取当前时间
  const nowTime = new Date().getTime();

  // 获取活动信息
  const activity = await db.collection('lucky_activity_list').doc(activityId).get();
  const activityInfo = activity.data[0];
  if (nowTime < new Date(activityInfo.beginTime)) {
    return {
      errorMsg: '活动未开始'
    }
  } 

  if (nowTime > new Date(activityInfo.endTime)) {
    // throw new Error('活动未开始或已结束');
    return {
      errorMsg: '活动已结束'
    }
  }

  // 获取奖品列表
  const prizesResult = await db.collection('lucky_award_config')
    .where({
      activityId: activityId,
      // totalNum: _.gt(0) // 只获取剩余数量大于已发放数量的奖品
    })
    .get();

  let prizes = prizesResult.data;
  prizes = prizes.filter(prize => prize.totalNum > prize.offerNum);

  if (prizes.length === 0) {
    return {
      errorMsg: '奖品已全部抽完'
    }
  }

  // 计算所有有效奖品的总概率
  let totalProbability = 0;
  for (const prize of prizes) {
    totalProbability += prize.probability;
  }
  // 检查总概率是否为0，如果为0则返回未中奖
  if (totalProbability === 0) {
    return { message: '未中奖' };
  }

  const notWinProbability = 100 - totalProbability;
  
  if (notWinProbability > 0) {
    totalProbability = notWinProbability + totalProbability
  }
  
  
  // 生成随机数用于抽奖
  const random = Math.random() * totalProbability;
  let cumulativeProbability = 0;
  let selectedPrize = null;

  // 遍历奖品列表，根据概率选择奖品
  for (const prize of prizes) {
    cumulativeProbability += prize.probability;
    if (random <= cumulativeProbability) {
      selectedPrize = prize;
      break;
    }
  }
  // 获取报名信息里的昵称、头像
  const joinRes = await db.collection('lucky_approve_list')
    .where({
      unionId: unionId,
      activityId: activityId
    })
    .get();
  const joinInfo = joinRes.data[0];
  const transaction = await db.startTransaction();
  await db.collection('lucky_approve_list')
    .where({
      unionId: unionId,
      activityId: activityId
    })
    .update({
      times: _.inc(-1) // 中不中奖都要扣次数
    })

  if (!selectedPrize) {
    return { message: '未中奖' };
  }

  try {
    // 更新奖品表中的已发放数量
    await transaction.collection('lucky_award_config').doc(selectedPrize._id).update({
      offerNum: _.inc(1)
    });
    // 添加中奖记录
    await transaction.collection('lucky_lottery_record').add({
      unionId,
      openId,
      activityId: activityId,
      activityName: activityInfo.activityName,
      prizeId: selectedPrize._id,
      prizeName: selectedPrize.prizeName,
      prizeImage: selectedPrize?.prizeImage,
      nickName: joinInfo.nickName,
      avatar: joinInfo.avatar,
      createdAt: nowTime
    });

    await transaction.commit();
    return {
      message: '中奖',
      prize: {
        prizeName: selectedPrize.prizeName,
        prizeImage: selectedPrize.prizeImage,
        prizeId: selectedPrize._id
      }
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error('抽奖失败，请重试', error);
  }
}