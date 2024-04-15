import { useEffect, useState } from 'react'
import Taro, { Config, useRouter } from '@tarojs/taro'
import { Button, Form, Picker, Image, Input, Divider } from "@nutui/nutui-react-taro"
import { Edit } from "@nutui/icons-react-taro"
import { DEFAULT_AVATAR, DEFAULT_GROUP, DISPLACEMENT } from '../../constant'
import { getOpenId } from "../../utils"
import CustomNoticeBar from '../../components/NoticeBar'
import "./bind.less"

interface Params {
  timer?: string; // 计时器号码 26,33
  timerId?: string; // 计时器 id

}

export default function BindWXTimer() {
  const [timerCode, setTimerCode] = useState<string>('');
  const [avatar, setAvatar] = useState<string>("");
  const [avatarFileId, setAvatarFileId] = useState<string>("");
  const [groupDataSource] = useState<any[]>(DEFAULT_GROUP);
  const [displacementDataSource] = useState<any[]>(DISPLACEMENT);
  const [showGroupPicker, setShowGroupPicker] = useState<boolean>(false);
  const [showDisplacementPicker, setShowDisplacementPicker] = useState<boolean>(false);
  const [openId, setOpenId] = useState<string>("");

  const router = useRouter<any>();

  useEffect(() => {
    const { params } = router as { params: Params };
    const { timer = '' } = params;
    setTimerCode(timer)
    form.setFieldsValue({ timerCode: timer })
    getUserOpenId()
  }, []);

  const getUserOpenId = async () => {
    const _openId = await getOpenId();
    setOpenId(_openId)
  }

  
  const uploadAvatar = async (e) => {
    const tempFilePath = e.detail.avatarUrl
    setAvatar(e.detail.avatarUrl)
    // 调用云函数上传文件
    try {
      const result = await Taro.cloud.uploadFile({
        cloudPath: `${openId}/avatar.jpg`, // 以用户的 OpenID 作为存储路径
        filePath: tempFilePath,
      });
      
      console.log('上传成功', result.fileID);
      setAvatarFileId(result.fileID)
    } catch (error) {
      console.error('上传失败', error);
    }
  }

  const doBind = async (values) => {
    const bindRes = await Taro.cloud.callFunction({
      name: 'bind_wx',
      data: {
        ...values,
        avatar: avatarFileId,
      }
    });
    if (bindRes) {
      Taro.showModal({
        title: "绑定成功",
        content: "加油吧~",
        success: () => {
          Taro.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    }
  }
  const [form] = Form.useForm()

  return <div className='bind-wx-timer'>
    <CustomNoticeBar closeable={true} text="绑定计时器仅当日有效，只有绑定微信才会记录到总排行榜" />
    
    <Form 
      form={form}
      onFinish={(values) => {
        doBind(values) 
      }}
      footer={
        <Button formType="submit" block type="primary">
          提交绑定
        </Button>
      }
    >
      <Form.Item
        required
        label="头像"
        name="avatar"
        className='avatar-form-item'
      >
        <Button className='avatar-choose-btn' openType='chooseAvatar' onChooseAvatar={uploadAvatar}>
          <Image error="点击上传"  className='avatar' src={avatar} width={80} height={80} radius={"50%"} />
          {!avatar && <div className='upload-tip'>点击上传</div>}
          {avatar && <Edit className='edit-icon' />}
        </Button>
      </Form.Item>
      <Form.Item
        required
        label="昵称"
        name="nickName"
      >
        <Input
          className="nut-input-text"
          placeholder="请输入用户名，用于在排行榜展示"
          type="nickname"
        />
      </Form.Item>
      <Form.Item
        label="计时器号码"
        name="timerCode"
        className='timer-form-item'
      >
        {/* <Input
          className="nut-input-text timer-code"
          readOnly={true}
          type="text"
        /> */}
        <div className='timer-code-block'>{timerCode}</div>
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
      onCancel={() => setShowDisplacementPicker(false)}
    />
  </div>
}