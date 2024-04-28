import { useEffect, useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Ad } from '@tarojs/components'
import { Image } from "@nutui/nutui-react-taro"
import RankBGImage from "./rank-bg.png"
import EmptyContent from '../../components/EmptyContent'
import TabBar from "../../components/TabBar"
import { formatMilliseconds } from '../../utils'
import { DEFAULT_AVATAR } from '../../constant'

import './rank.less'

const TAB_LIST = ['巅峰榜'];
const NO_ICON = ['../../../../assets/no-1.png','../../../../assets/no-2.png','../../../../assets/no-3.png']

export default function TotalRank() {
  const [rankList, setRankList] = useState<any>([]);
  const [topRankList, setTopRankList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0)

  useEffect(() => {
    getRankData()
  }, [])

  useShareAppMessage(() => {
    return {
      title: '胜道巅峰榜',
      path: '/pages/rank/index',
    };
  });

  const getRankData = async () => {
    setLoading(true)
    Taro.showLoading()
    const { result } = await Taro.cloud.callFunction({
      name: 'query_total_rank',
    });
    const rankList = (result as any[]).map(record => {
      return {
        ...record,
        lap_time: formatMilliseconds(record.single_score)
      }
    });
    setTopRankList(rankList.splice(0, 3))
    console.log({rankList})
    setRankList(rankList)
    Taro.hideLoading()
    setLoading(false)
  }

  if (!rankList.length && !loading) {
    return <EmptyContent />
  }

  return (
    <View className='total-rank-container'>
      <TabBar tabList={TAB_LIST} onTabChange={(e) => setActiveTab(e)}/>
      <div className='rank-top-container'>
        { !!topRankList.length && <TopRankUserInfo rankInfo={topRankList[0]} rank={1} /> }
        { topRankList.length > 1 && <TopRankUserInfo rankInfo={topRankList[1]} rank={2} /> }
        { topRankList.length > 2 && <TopRankUserInfo rankInfo={topRankList[2]} rank={3} /> }
        <Image className='rank-bottom-bg' src={RankBGImage}  width={'100%'} height={170}  />
      </div>
      <div className='table-container'>
        <div className='table-th'>
          <div className='th-no'>Pos</div>
          <div className='th-user'>Driver</div>
          <div className='th-car'>Model</div>
          <div className='th-score'>Tm</div>
          <div className='th-gmt'>Lap Time</div>
        </div>
        {
            rankList.map((record, no) => <div className='table-row'>
              <div className='noth-cell'>
                <div className={`noth`}>
                  <span>{no + 4}</span>
                </div>
              </div>
              <div className='user-cell'>
                <Image className='item-avatar' src={record.avatar || DEFAULT_AVATAR} width={30} height={30} radius={"50%"} />
                <div className='item-name'>
                    {record.nick_name ? `${record.nick_name}` : 'unknown'}
                </div>
              </div>
              <div className='car-cell'>
                {record.carName || '-'}
              </div>
              <div className='score-cell'>
                {record.lap_time}
              </div>
              <div className='gmt-cell'>
                {record.lap_create_time}
              </div>
            </div>)
          }
      </div>
    </View>
  )
}

function TopRankUserInfo (props: any) {
  const { rankInfo, rank} = props;
  return <div className={`top-rank-user-info rank-${rank}`}>
    <Image lazyLoad className='top-avatar' src={rankInfo?.avatar} width={50} height={50} radius={"50%"}/>
    <span className={`no-icon no-${rank}`} />
    <div className='nick-name'>{rankInfo.nick_name}</div>
    <div className='best-score'>{rankInfo.lap_time}</div>
    <div className='best-score'>{rankInfo.carName}</div>
  </div>
}