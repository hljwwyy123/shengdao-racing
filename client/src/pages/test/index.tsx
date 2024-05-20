import { useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Button, Form, DatePicker, Switch, Image, Input, Divider } from "@nutui/nutui-react-taro"


export default function Test() {

    const getActivityList = async () => {
        const res = await Taro.cloud.callFunction({
            name: 'lucky_get_activity_list'
        });

        console.log(res.result)
    }

    const getActivityInfo = async () => {
        const res = await Taro.cloud.callFunction({
            name: 'lucky_get_activity_info',
            data: {
                // id: "addca5a1664b4ec80144eb585ac2ee85"
                id: "8212c3bc664b4e2d01403fb844ca9379"
            }
        });

        console.log(res.result)
    }

    return <View>
        <Button onClick={getActivityList} >获取活动列表</Button>
        <Button onClick={getActivityInfo} >获取活动详情</Button>
    </View>
}