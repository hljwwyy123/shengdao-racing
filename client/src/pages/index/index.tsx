import { Component, PropsWithChildren } from 'react'
import Taro, { Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Button } from "@nutui/nutui-react-taro"
import './index.less'

import Login from '../../components/login/index'

export default class Index extends Component<PropsWithChildren> {
  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  postdata = async () => {
    Taro.cloud.callFunction({
      name: 'post_score_fromlocal',
      data: {
        body: [
          {
            "car_name":"26号",
            "dateTime":1712136373670,
            "lap_create_time": "2024-04-10 12:00:08",
            "single_score": 33333,
          },
          {
            "car_name":"28号",
            "dateTime":1712136373670,
            "lap_create_time": "2024-04-10 13:26:08",
            "single_score": 4444,
          },
        ]
      }

    })
  }

  render () {
    return (
      <View className='index'>
        <Login/>
        <Button onClick={this.postdata} type='primary'>模拟本地node提交数据</Button>
      </View>
    )
  }
}
