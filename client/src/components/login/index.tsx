import { Component, PropsWithChildren } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

export default class Index extends Component<PropsWithChildren> {
  state = {
    context: {}
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getLogin = async () => {
    const res: any = await Taro.cloud.callFunction({
        name: "login",
      });
    console.log({res})
    this.setState({
      context: res.result
    })
  }

  render() {
    return (
      <View className='index'>
        <Button onClick={this.getLogin}>获取登录云函数</Button>
        <Text>context：{JSON.stringify(this.state.context)}</Text>
      </View>
    )
  }
}
