import { useEffect, useState } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Button } from "@nutui/nutui-react-taro"


import './rank.less'


export default function Mine() {
  const [rankList, setRankList] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRankData()
  }, [])

  const getRankData = async () => {
    setLoading(true)
    const { result } = await Taro.cloud.callFunction({
      name: 'query_total_rank',
    });
    // const listData = aggregateRealTimeData(result)

    console.log({result})
    // setRankList(result.data)
    // setLoading(false)
  }

  return (
    <View className='mine-container'>
      总排行榜
      <Button onClick={getRankData}>获取数据</Button>
    </View>
  )
}