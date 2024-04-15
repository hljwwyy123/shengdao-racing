import { useEffect, useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Image } from "@nutui/nutui-react-taro"
import RankBGImage from "./rank-bg.png"
import EmptyContent from '../../components/EmptyContent'
import TabBar from "../../components/TabBar"
import { formatMilliseconds } from '../../utils'
import { DEFAULT_AVATAR } from '../../constant'

import './rank.less'

const TAB_LIST = ['巅峰榜'];

export default function Mine() {
  const [rankList, setRankList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0)

  useEffect(() => {
    getRankData()
  }, [])

  useShareAppMessage(() => {
    return {
      title: '胜道巅峰榜', // 分享标题
      path: '/pages/rank/index', // 分享路径，通常为当前页面路径
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
        { !!rankList.length && <TopRankUserInfo rankInfo={rankList[0]} rank={1} /> }
        { rankList.length > 1 && <TopRankUserInfo rankInfo={rankList[1]} rank={2} /> }
        { rankList.length > 2 && <TopRankUserInfo rankInfo={rankList[2]} rank={3} /> }
        <Image className='rank-bottom-bg' src={RankBGImage}  width={'100%'} height={170}  />
      </div>
      <div className='rank-list'>
        <div className='rank-th'>
          <div className='rank-no'>排名</div>
          <div className='rank-user'>选手</div>
          <div className='rank-score'>圈速</div>
        </div>
        {
            rankList.map((record, no) => <div className='rank-item'>
              <div className='noth-cell'>
                <div className={`noth ${no < 3 ? `th-${no+1}` : ''}`}>
                  {
                    no >= 3 && <span>{no + 1}</span>
                  }
                </div>
              </div>
              <div className='rank-item-title'>
                <Image className='item-avatar' src={record.avatar || DEFAULT_AVATAR} width={30} height={30} radius={"50%"} />
                <div className='item-name'>
                  <div>{record.timer_num}</div>
                  <div>{record.nick_name ? `${record.nick_name}` : ''}</div>
                </div>
              </div>
              <div className='item-score'>
                {record.lap_time}
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
    <Image className='top-avatar' src={rankInfo?.avatar} width={50} height={50} radius={"50%"}/>
    <div className='nick-name'>{rankInfo.nick_name}</div>
    <div className='best-score'>{rankInfo.lap_time}</div>
  </div>
}