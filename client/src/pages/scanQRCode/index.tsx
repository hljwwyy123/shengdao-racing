import { Component, useEffect, useRef, useState } from 'react'
import Taro, { Config, useRouter } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Dialog, Button, Form, Image, Input } from "@nutui/nutui-react-taro"
import './index.less'

interface Params {
  timer?: string; // 计时器号码 26,33
  timerId?: string; // 计时器 id
}

const DEFAULT_AVATAR = "https://img.alicdn.com/imgextra/i1/O1CN01zemuyx1Vrr63rF6Ms_!!6000000002707-0-tps-699-722.jpg";

export default function ScanCode() {
  const [timerCode, setTimerCode] = useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>({})
  const formRef: any = useRef(null)
  const router = useRouter<any>();

  useEffect(() => {
    // Taro 页面获取 onLoad 传递的参数
    const { params } = router as { params: Params };
    const { timer = '', timerId = '' } = params;
    setTimerCode(timer)
  }, []);

  const onBind = async () => {
    Taro.getUserProfile({
      desc: '用于完善会员信息',
      success: async (e: any) => {
        // const { avatar, nickName, gender } = e.userInfo;
        // console.log({avatar, nickName, gender})
        setUserInfo(e.userInfo);
        setShowConfirmDialog(true)
      }
    })
  }

  const doBind = async () => {
    console.log(formRef.current)
    // const formValue: any = await formRef.current.submit();
    const nickName = formRef.current.getFieldValue('nickName')
    const carName = formRef.current.getFieldValue('carName')
    const bindRes = await Taro.cloud.callFunction({
      name: 'bind_wx',
      data: {
        nickName,
        carName,
        avatar: userInfo.avatar || DEFAULT_AVATAR,
        gender: userInfo.gender, // gender 0: Unknown, 1: Male, 2: Female 
        timerCode
      }
    });
    if (bindRes) {
      console.log({bindRes})
      Taro.showModal({
        title: "绑定成功",
        content: "加油吧~"
      })
    }
  }

  return <View className='qrcode-wrapper'>
    <View>计时器号码：{timerCode}</View>
    <Button type='primary' onClick={onBind}>填写信息，绑定计时器</Button>
    <Dialog
      visible={showConfirmDialog}
      footer={
        <Button type='primary' onClick={doBind}>绑定</Button>
      }
    >
      <View>
        <Image src={userInfo.avatar || DEFAULT_AVATAR} width={68} height={68} radius={"50%"} />
        <Form 
          ref={formRef}
          // onFinish={(values) => { console.log('onfinsih -=-', values);doBind(values) }}
          initialValues={{ nickName: userInfo.nickName }}
          footer={null}
        >
          <Form.Item
            required
            label="昵称"
            name="nickName"
          >
            <Input
              className="nut-input-text"
              placeholder="请输入用户名，用于在排行榜展示"
              type="text"
            />
          </Form.Item>
          <Form.Item
            label="赛车型号"
            name="carName"
          >
            <Input
              className="nut-input-text"
              placeholder="请输入赛车型号，用于在排行榜展示"
              type="text"
            />
          </Form.Item>
        </Form>
        <View>计时器微信绑定</View>
        <View>绑定微信后可通过小程序查看实时成绩呦~</View>
      </View>
    </Dialog>
  </View>
}

