import { useEffect, useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { Collapse, Image, Button, PullToRefresh } from "@nutui/nutui-react-taro"
import { ArrowRight, ArrowDown } from '@nutui/icons-react-taro'
import { aggregateRealTimeData } from "../../utils"
import { DEFAULT_AVATAR } from '../../constant'
import { REAL_SCORE_ITEM, SCORE_DETAIL_ITEM } from 'src/type/realTime'
import TabBar from "../../components/TabBar"
import EmptyContent from '../../components/EmptyContent'
import cloneDeep from 'lodash.clonedeep'
import './index.less'

let initedFetch = false;
const TAB_LIST = ['实时成绩', '今日榜单'];

export default function Index() {
  const [rankList, setRankList] = useState<any>([]);
  const [rankNoList, setRankNoList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [activeCollspan, setActiveCollspan] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<number>(0)

  useEffect(() => {
    getRealTimeScore()
  }, [])

  useShareAppMessage(() => {
    return {
      title: '胜道巅峰榜', // 分享标题
      path: '/pages/index/index', // 分享路径，通常为当前页面路径
    };
  });

  const getRealTimeScore = async () => {
    !initedFetch && Taro.showLoading()
    setLoading(true)
    const { result } = await Taro.cloud.callFunction({
      name: 'query_realtime_score',
    });
    const listData = aggregateRealTimeData(result)
    setRankList(listData)
    const _rankList = cloneDeep(listData)
    console.log({_rankList})
    const noList = _rankList.sort((a, b) => a.single_score - b.single_score);
    setRankNoList(noList)
    setLoading(false)
    !initedFetch && Taro.hideLoading()
    initedFetch = true
  }
  
  const onCollspanChange = (
    activeName: string | string[],
  ) => {
    console.log('activeName -- ',[activeName[activeName.length - 1]] as string[])
    setActiveCollspan([activeName[activeName.length - 1]] as string[])

  }

  return (
    <div className='index'>
      {/* <Button onClick={postdata} type='primary'>模拟本地node提交数据</Button> */}
      <TabBar tabList={TAB_LIST} onTabChange={(e) => setActiveTab(e)}/>
      {
        activeTab == 0 &&
        <PullToRefresh 
          // pullingText=" "
          // refreshingText=" "
          completeText=" "
          onRefresh={() =>
            getRealTimeScore()
          }
          renderIcon={(status) => {
            return (
              <div>
                {(status === 'pulling' || status === 'complete') && (
                  <img
                    alt=""
                    style={{ height: '26px', width: '36px' }}
                    src="https://img10.360buyimg.com/imagetools/jfs/t1/230454/20/14523/223/65fab2d1F379c3968/ac35992443abab0c.png"
                  />
                )}
                {(status === 'canRelease' || status === 'refreshing') && (
                  <img
                    alt=""
                    style={{ height: '26px', width: '36px' }}
                    src="https://img.alicdn.com/imgextra/i3/O1CN01Hso8lx1rexUYpctvl_!!6000000005657-2-tps-48-48.png"
                  />
                )}
              </div>
            )
          }}
        >
          <div className='rank-th'>
            <div>选手</div>
            <div className='th-score'>圈速</div>
            <div>总圈数</div>
          </div>
          { !rankList.length && !loading && <EmptyContent text='暂无数据哦~' />}
          <Collapse activeName={activeCollspan} className='rank-list-container' onChange={onCollspanChange}>
            {
              rankList.map((record: REAL_SCORE_ITEM, index: number) => <Collapse.Item 
                name={record.timer_num}
                className='rank-item'
                title={<div className='rank-item-title'>
                  <Image className='item-avatar' lazyLoad src={record.avatar || DEFAULT_AVATAR} width={30} height={30} radius={"50%"} />
                  <div className='item-name'>
                    <div>{record.timer_num}</div>
                    <div>{record.nickName ? `${record.nickName}` : ''}</div>
                  </div>
                  
                </div>}
                extra={
                  <div className='extra-cell'>
                    <div className='best-score'>{record.bestScore}</div>
                    <div className='total-lap'><b>{record.totalLap}</b>{ record.timer_num === activeCollspan[0] ? <ArrowDown /> : <ArrowRight />}</div>
                  </div>
                }
              >
                  <div className='rank-item-record-list'>
                    <div className='detail-item-th'>
                        <div >序号</div>
                        <div className='detail-item-score'>成绩</div>
                        <div className='detail-item-recordtime'>记录时间</div>
                    </div>
                    {
                      record.records.map((detailItem: SCORE_DETAIL_ITEM, index: number) => <div className='rank-item-detail-item'>
                        <div className='detail-item-no'>{record.records.length - index}</div>
                        <div className='detail-item-score'>{detailItem.lapTime}</div>
                        <div>{detailItem.lap_create_time_hour}</div>
                      </div>)
                    }
                  </div>
              </Collapse.Item>
              )
            }
          </Collapse>
        </PullToRefresh>
      }
      {
        activeTab == 1 && 
        <div className='rank-no-list-container'>
          <div className='rank-th'>
            <div>排名</div>
            <div className='rank-no-score'>选手</div>
            <div>圈速</div>
          </div>
          { !rankList.length && !loading && <EmptyContent text='暂无数据哦~' />}
          {
            rankNoList.map((record, no) => <div className='rank-item'>
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
                  <div>{record.nickName ? `${record.nickName}` : ''}</div>
                </div>
              </div>
              <div className='item-score'>
                {record.bestScore}
              </div>
            </div>)
          }
        </div>
      }
    </div>
  )
}
