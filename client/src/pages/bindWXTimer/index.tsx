import { useEffect, useState } from 'react'
import Taro, { Config, useRouter } from '@tarojs/taro'
import { Button, Form, Picker, Image, Input, Divider } from "@nutui/nutui-react-taro"
import { DEFAULT_AVATAR, DEFAULT_GROUP, DISPLACEMENT } from '../../constant'
import CustomNoticeBar from '../../components/NoticeBar'
import "./bind.less"

interface Params {
  timer?: string; // 计时器号码 26,33
  timerId?: string; // 计时器 id

}

export default function BindWXTimer() {
  const [timerCode, setTimerCode] = useState<string>('');
  const [userInfo, setUserInfo] = useState<any>({});
  const [groupDataSource] = useState<any[]>(DEFAULT_GROUP);
  const [displacementDataSource] = useState<any[]>(DISPLACEMENT);
  const [showGroupPicker, setShowGroupPicker] = useState<boolean>(false);
  const [showDisplacementPicker, setShowDisplacementPicker] = useState<boolean>(false);
  
  const router = useRouter<any>();

  useEffect(() => {
    const { params } = router as { params: Params };
    const { timer = '', timerId = '' } = params;
    setTimerCode(timer)
    const _userInfo = Taro.getStorageSync("userInfo");
    setUserInfo(_userInfo)
    
    form.setFieldsValue({ timerCode: timer })
    form.setFieldsValue({ nickName: _userInfo.nickName })
  }, [])

  const doBind = async (values) => {
    const bindRes = await Taro.cloud.callFunction({
      name: 'bind_wx',
      data: {
        ...values,
        avatar: userInfo.avatar || DEFAULT_AVATAR,
        gender: userInfo.gender, // gender 0: Unknown, 1: Male, 2: Female 
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
  const [form] = Form.useForm()

  return <div className='bind-wx-timer'>
    <CustomNoticeBar closeable={true} text="绑定计时器仅当日有效，只有绑定微信才会记录到总排行榜" />
    <Image className='avatar' src={userInfo.avatar || DEFAULT_AVATAR} width={80} height={80} radius={"50%"} />
    <Form 
      form={form}
      onFinish={(values) => {
        doBind(values) 
      }}
      footer={
        <Button formType="submit" block type="primary">
          提交
        </Button>
      }
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
        label="计时器号码"
        name="timerCode"
      >
        <Input
          className="nut-input-text"
          readOnly={true}
          type="text"
        />
      </Form.Item>
      <Divider />
      <Form.Item
        label="赛车型号"
        name="carName"
      >
        <Input
          className="nut-input-text"
          placeholder="忍4，R3"
          type="text"
        />
      </Form.Item>
      <Form.Item
        label="排量"
        name="displacement"
        onClick={() => setShowDisplacementPicker(true)}
      >
        <Input
          className="nut-input-text"
          placeholder="赛车排量"
          type="text"
        />
      </Form.Item>
      <Form.Item
        label="分组"
        name="group"
        onClick={() => setShowGroupPicker(true)}
      >
        <Input
          className="nut-input-text"
          readOnly={true}
          placeholder="组别"
          type="text"
        />
      </Form.Item>
    </Form>
    <Picker 
      options={groupDataSource}
      visible={showGroupPicker}
      onConfirm={(selectOptions, selectValue) => {
        setShowGroupPicker(false);
        form.setFieldsValue({ group: selectValue[0] })
      }}
      onCancel={() => setShowGroupPicker(false)}
    />
    <Picker 
      options={displacementDataSource}
      visible={showDisplacementPicker}
      onConfirm={(selectOptions, selectValue) => {
        setShowDisplacementPicker(false);
        form.setFieldsValue({ displacement: selectValue[0] })
      }}
      onCancel={() => setShowGroupPicker(false)}
    />
  </div>
}