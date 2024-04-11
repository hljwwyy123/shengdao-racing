import { useEffect, useState } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Collapse, Image, Toast, Button, PullToRefresh } from "@nutui/nutui-react-taro"
import moment from "moment"
import { randomScore, aggregateRealTimeData } from "../../utils"
import './index.less'
import { DEFAULT_AVATAR } from '../../constant'
import { REAL_SCORE_ITEM, SCORE_DETAIL_ITEM } from 'src/type/realTime'


export default function Index() {
  const [rankList, setRankList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("...");
  const [activeCollspan, setActiveCollspan] = useState<string[]>([])

  useEffect(() => {
    getRealTimeScore()
  }, [])
  const postdata = async () => {
    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
    await Taro.cloud.callFunction({
      name: 'post_score_fromlocal',
      data: {
        body: [
          // {
          //   "car_name":"26号",
          //   "dateTime":1712136373670,
          //   "lap_create_time": nowTime,
          //   "single_score": randomScore(),
          // },
          {
            "car_name":"28号",
            "dateTime":1712136373670,
            "lap_create_time": nowTime,
            "single_score": randomScore(),
          },
          // {
          //   "car_name":"5号",
          //   "dateTime":1712136373670,
          //   "lap_create_time": nowTime,
          //   "single_score": randomScore(),
          // },
        ]
      }

    })
    getRealTimeScore()
  }

  const getRealTimeScore = async () => {
    setLoading(true)
    const { result } = await Taro.cloud.callFunction({
      name: 'query_realtime_score',
    });
    const listData = aggregateRealTimeData(result)
    console.log({listData})
    setRankList(listData)
    setLoading(false)
  }
  
  const onCollspanChange = (
    activeName: string | string[],
    name: string,
    isOpen: boolean
  ) => {
    setActiveCollspan([activeName[activeName.length - 1]] as string[])
  }

  return (
    <View className='index'>
      <View>
        <Button onClick={postdata} type='primary'>模拟本地node提交数据</Button>
      </View>
      <PullToRefresh 
        // pullingText=" "
        // refreshingText=" "
        completeText=" "
        onRefresh={() =>
          getRealTimeScore()
        }
        renderIcon={(status) => {
          return (
            <View>
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
            </View>
          )
        }}
      >
        <Collapse activeName={activeCollspan} className='rank-list-container' onChange={onCollspanChange}>
          {
            rankList.map((record: REAL_SCORE_ITEM) => <Collapse.Item 
              name={record.timer_num}
              className='rank-item'
              title={<View className='rank-item-title'>
                <Image className='item-avatar' src={record.avatar || DEFAULT_AVATAR} width={30} height={30} radius={"50%"} />
                <View className='item-name'>
                  <View>{record.timer_num}</View>
                  <View>{record.nickName ? `${record.nickName}` : ''}</View>
                </View>
                
              </View>}
              extra={
                <View className='extra-cell'>
                  <View className='best-score'>{record.bestScore}</View>
                  <View className='total-lap'><b>总圈数：</b>{record.totalLap}</View>
                </View>
              }
            >
                <View className='rank-item-record-list'>
                  <View className='detail-item-th'>
                      <View >序号</View>
                      <View className='detail-item-score'>成绩</View>
                      <View className='detail-item-recordtime'>记录时间</View>
                  </View>
                  {
                    record.records.map((detailItem: SCORE_DETAIL_ITEM, index: number) => <View className='rank-item-detail-item'>
                      <View className='detail-item-no'>{record.records.length - index}</View>
                      <View className='detail-item-score'>{detailItem.lapTime}</View>
                      <View>{detailItem.lap_create_time_hour}</View>
                    </View>)
                  }
                </View>
            </Collapse.Item>
            )
          }
        </Collapse>
      </PullToRefresh>
      {/* <Toast
        type="text"
        visible={loading}
        content={loadingText}
        onClose={() => {
          setLoading(false)
        }}
      /> */}
    </View>
  )
}
