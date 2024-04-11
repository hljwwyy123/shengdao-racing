import { useEffect, useState } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Button } from "@nutui/nutui-react-taro"
import { formatMilliseconds } from '../../utils'

import './my.less'


export default function Mine() {
  const [loading, setLoading] = useState(false);
  const [bestScoreInfo, setBestScoreInfo] = useState<any>({});
  const [totalLapNum, setTotalLapNum] = useState<number>(0);

  useEffect(() => {
    getMyRank()
  }, []);

  const getMyRank = async () => {
    const res: any = await Taro.cloud.callFunction({
      name: 'find_my_bestscore',
    });
    if (res.result?.data) {
      const { data } = res.result;
      setBestScoreInfo(data.record)
      setTotalLapNum(data.totalLapNum)
    } else {

    }
  }

  return (
    <View className='mine-container'>
      <View>我的最好成绩是：{bestScoreInfo?.single_score ? formatMilliseconds(bestScoreInfo?.single_score) : "-"}</View>
      <View>我总过跑过：{totalLapNum}圈</View>
    </View>
  )
}