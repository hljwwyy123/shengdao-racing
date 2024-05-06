import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Grid, Cell } from "@nutui/nutui-react-taro"
import { Comment, List, Flag, Coupon, Notice, ArrowRight } from '@nutui/icons-react-taro'
import { formatMilliseconds, getOpenId } from '../../utils'
const commentPlugin = Taro.requirePlugin("wxacommentplugin");
import './my.less'


export default function Mine() {
  const [bestScoreInfo, setBestScoreInfo] = useState<any>({});
  const [totalLapNum, setTotalLapNum] = useState<number>(0);
  const [openId, setOpenId] = useState<string>('')

  useEffect(() => {
    getMyRank()
    getOpenId().then(res => setOpenId(res))
  }, []);

  const getMyRank = async () => {
    Taro.showLoading()
    const res: any = await Taro.cloud.callFunction({
      name: 'find_my_bestscore',
    });
    if (res.result?.data) {
      const { data } = res.result;
      setBestScoreInfo(data.record)
      setTotalLapNum(data.totalLapNum)
    }
    Taro.hideLoading()
  }


  return (
    <View className='mine-container'>
      <div className='section-title'>我的数据</div>
      <Grid columns={2}>
        <Grid.Item text="最快圈速">
          {bestScoreInfo?.single_score ? formatMilliseconds(bestScoreInfo?.single_score) : "-"}
        </Grid.Item>
        <Grid.Item text="总圈数">
        {totalLapNum}圈
        </Grid.Item>
      </Grid>
      <Cell 
        extra={<ArrowRight />} 
        onClick={() => Taro.navigateTo({url: '/pages/history/index'})}
        title={<div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <List />
          <span style={{ marginLeft: '5px' }}>历史数据</span>
        </div>}
      />
      <div className='section-title'>赛场</div>
      <Cell 
        extra={<ArrowRight />} 
        onClick={() => Taro.navigateTo({url: '/pages/track/index'})}
        title={<div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Flag />
          <span style={{ marginLeft: '5px' }}>关于赛场</span>
        </div>}
      />
      <Cell 
        extra={<ArrowRight />} 
        onClick={() => Taro.navigateTo({url: '/pages/activity/index'})}
        title={<div style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Notice />
          <span style={{ marginLeft: '5px' }}>活动中心</span>
        </div>}
      />
      <Cell 
        extra={<ArrowRight />} 
        onClick={() => commentPlugin.openComment({})}
        title={<div style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <Comment />
          <span style={{ marginLeft: '5px' }}>反馈建议</span>
        </div>}
      />
    </View>
  )
}