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

    const getAwardConfig = async () => {
        const res = await Taro.cloud.callFunction({
            name: 'lucky_get_award_info',
            data: {
                activityId: "318e0c7e664ca40f01510f0732d2f5e9"
            }
        });

        console.log(res)
    }

    const updateAwardConfig = async () => {
        const res = await Taro.cloud.callFunction({
            name: 'lucky_update_award_info',
            data: {
                // activityId: "318e0c7e664ca40f01510f0732d2f5e9",
                id: '318e0c7e665098a8017ff95463f822d1',
                prizeInfo: {prizeName: '123qwe',prizeNum: 3}
            }
        });
        console.log(res.result)
    }

    const delerteAwardConfig = async () => {
        const res = await Taro.cloud.callFunction({
            name: 'lucky_delete_award_info',
            data: {
                // activityId: "318e0c7e664ca40f01510f0732d2f5e9",
                id: '318e0c7e665098a8017ff95463f822d1',
            }
        });
        console.log(res.result)
    }

    const draw = async () => {
        const res = await Taro.cloud.callFunction({
            name: 'lucky_lottery',
            data: {
                activityId: "318e0c7e664ca40f01510f0732d2f5e9",
            }
        });
        console.log(res.result)
    }

    const drawRecord = async () => {
        const res = await Taro.cloud.callFunction({
            name: 'lucky_get_activity_lottery_record',
            data: {
                activityId: "318e0c7e664ca40f01510f0732d2f5e9",
            }
        });
        console.log(res.result)
    }

    return <View>
        <Button onClick={getActivityList} >获取活动列表</Button>
        <Button onClick={getActivityInfo} >获取活动详情</Button>
        <Button onClick={getAwardConfig} >获取活动奖品配置</Button>
        <Button onClick={updateAwardConfig} >更新活动奖品配置</Button>
        <Button onClick={delerteAwardConfig} >删除活动奖品配置</Button>
        <Button onClick={draw} type='success' >抽奖</Button>
        <Button onClick={drawRecord} type='success' >抽奖记录</Button>
    </View>
}