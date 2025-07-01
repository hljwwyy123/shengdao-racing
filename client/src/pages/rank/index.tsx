import { useEffect, useState, useRef } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { View, Ad } from '@tarojs/components'
import { Image } from "@nutui/nutui-react-taro"
import RankBGImage from "./rank-bg.png"
import EmptyContent from '../../components/EmptyContent'
import TabBar from "../../components/TabBar"
// import SuiteAdBar from '../../components/SuiteAd'
import { formatMilliseconds } from '../../utils'
import { DEFAULT_AVATAR } from '../../constant'

import './rank.less'

const TAB_LIST = ['摩托车榜', '汽车榜'];
const NO_ICON = ['../../../../assets/no-1.png','../../../../assets/no-2.png','../../../../assets/no-3.png']

export default function TotalRank() {
  const [motorRankList, setMotorRankList] = useState<any[]>([]);
  const [topMotorRankList, setTopMotorRankList] = useState<any[]>([]);
  const [carRankList, setCarRankList] = useState<any[]>([]);
  const [topCarRankList, setTopCarRankList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0)
  const loadedTabs = useRef<boolean[]>([false, false]);

  useEffect(() => {
    if (loadedTabs.current[activeTab]) {
      return;
    }
    const vehicleType = activeTab === 0 ? 'motorcycle' : 'car';
    getRankData(vehicleType);
  }, [activeTab])

  useShareAppMessage(() => {
    return {
      title: '胜道巅峰榜',
      path: '/pages/rank/index',
    };
  });

  const getRankData = async (vehicleType: 'motorcycle' | 'car') => {
    setLoading(true)
    Taro.showLoading()
    const { result } = await Taro.cloud.callFunction({
      name: 'query_total_rank',
      data: { vehicleType }
    });
    const formattedList = (result as any[]).map(record => {
      return {
        ...record,
        lap_time: formatMilliseconds(record.single_score)
      }
    });

    if (vehicleType === 'motorcycle') {
      setTopMotorRankList(formattedList.slice(0, 3));
      setMotorRankList(formattedList.slice(3));
    } else {
      setTopCarRankList(formattedList.slice(0, 3));
      setCarRankList(formattedList.slice(3));
    }
    loadedTabs.current[activeTab] = true;
    
    Taro.hideLoading()
    setLoading(false)
  }

  const currentTopRankList = activeTab === 0 ? topMotorRankList : topCarRankList;
  const currentRankList = activeTab === 0 ? motorRankList : carRankList;

  // if (!currentRankList.length && !loading) {
  //   return <EmptyContent />
  // }

  const previewAvatar = (url: string) => {
    Taro.previewImage({
      urls: [url]
    })
  }

  return (
    <View className='total-rank-container'>
      <TabBar tabList={TAB_LIST} activeTab={activeTab} onTabChange={(e) => setActiveTab(e)}/>
      {
        (!currentRankList.length && !loading) ? <EmptyContent />
        : 
        <div>
          <div className='rank-top-container'>
            { !!currentTopRankList.length && <TopRankUserInfo rankInfo={currentTopRankList[0]} rank={1} onPreview={previewAvatar} /> }
            { currentTopRankList.length > 1 && <TopRankUserInfo rankInfo={currentTopRankList[1]} rank={2} onPreview={previewAvatar} /> }
            { currentTopRankList.length > 2 && <TopRankUserInfo rankInfo={currentTopRankList[2]} rank={3} onPreview={previewAvatar} /> }
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
                currentRankList.map((record, no) => <div className='table-row'>
                  <div className='noth-cell'>
                    <div className={`noth`}>
                      <span>{no + 4}</span>
                    </div>
                  </div>
                  <div className='user-cell'>
                    <Image className='item-avatar' onClick={() => previewAvatar(record.avatar)} src={record.avatar || DEFAULT_AVATAR} width={30} height={30} radius={"50%"} />
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
              {/* <SuiteAdBar id={2} /> */}
          </div>
        </div>
      
      }
    </View>
  )
}

function TopRankUserInfo (props: any) {
  const { rankInfo, rank, onPreview} = props;
  return <div className={`top-rank-user-info rank-${rank}`}>
    <Image lazyLoad onClick={() => onPreview(rankInfo?.avatar)} className='top-avatar' src={rankInfo?.avatar} width={50} height={50} radius={"50%"}/>
    <span className={`no-icon no-${rank}`} />
    <div className='nick-name'>{rankInfo.nick_name}</div>
    <div className='best-score'>{rankInfo.lap_time}</div>
    <div className='best-score'>{rankInfo.carName}</div>
  </div>
}