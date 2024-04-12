import { useEffect, useState } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import RankBGImage from "./rank-bg.png"
import EmptyContent from '../../components/EmptyContent'
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

    console.log({result})
    setRankList(result)
    setLoading(false)
  }

  if (!rankList.length && !loading) {
    return <EmptyContent />
  }

  return (
    <View className='mine-container'>
      <div className='rank-top-container'>
        <TopRankUserInfo rankInfo={rankList[0]} />
        <img className='rank-bottom-bg' src={RankBGImage} />
      </div>
    </View>
  )
}

function TopRankUserInfo (p: any) {
  return <div className='top-rank-user-info'>
    
  </div>
}