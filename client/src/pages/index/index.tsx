import { useEffect, useRef, useState } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Button, Overlay, Loading } from "@nutui/nutui-react-taro"
import moment from "moment"
import { randomScore, formatMilliseconds, aggregateRealTimeData } from "../../utils"
import './index.less'

const WrapperStyle = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center'
}

export default function Index() {
  const [rankList, setRankList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getRealTimeScore()
  }, [])
  const postdata = async () => {
    const nowTime = moment().format('YYYY-MM-DD HH:mm:ss');
    await Taro.cloud.callFunction({
      name: 'post_score_fromlocal',
      data: {
        body: [
          {
            "car_name":"26号",
            "dateTime":1712136373670,
            "lap_create_time": nowTime,
            "single_score": randomScore(),
          },
          {
            "car_name":"28号",
            "dateTime":1712136373670,
            "lap_create_time": nowTime,
            "single_score": randomScore(),
          },
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
  

  return (
    <View className='index'>
      <View>
        <Button onClick={postdata} type='primary'>模拟本地node提交数据</Button>
      </View>
      {/* <View>
        <Button onClick={getRealTimeScore} type='primary'>获取实时数据</Button>
      </View> */}
      <Overlay visible={loading}>
        <View className="rank-list-wrapper" style={WrapperStyle}>
          <Loading direction="vertical">加载中</Loading>
        </View>
      </Overlay>
      
      <View className='rank-list-container'>
        {
          rankList.map((record: any) => <View className='rank-item'>
            <View>{record.timer_num}</View>
            <View>{record.nickName}</View>
            <View>最好成绩：{record.bestScore}</View>
            <View>总圈数：{record.totalLap}</View>
          </View>)
        }
      </View>
    </View>
  )
}
