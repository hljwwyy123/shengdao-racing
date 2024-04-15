import { useEffect, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Button } from "@nutui/nutui-react-taro"
import CustomNoticeBar from '../../components/NoticeBar';
import './index.less'

interface Params {
  timer?: string; // 计时器号码 26,33
  timerId?: string; // 计时器 id
}

export default function ScanCode() {
  const [timerCode, setTimerCode] = useState<string>('');
  const [useProfile] = useState<boolean>(Taro.canIUse('getUserProfile'))
  const router = useRouter<any>();

  useEffect(() => {
    // Taro 页面获取 onLoad 传递的参数
    const { params } = router as { params: Params };
    const { timer = '', timerId = '' } = params;
    setTimerCode(timer)
  }, []);

  const onBind = async () => {
    const _userInfo = Taro.getStorageSync("userInfo");
    console.log('获取本地缓存_userinfo', _userInfo)
    if (!_userInfo) {
      Taro.getUserProfile({
        desc: '用于在排行榜中展示信息',
        success: (e: any) => {
          const { avatar, nickName, gender } = e.userInfo;
          console.log({avatar, nickName, gender})
          Taro.setStorageSync("userInfo", e.userInfo)
          Taro.navigateTo({
            url: '/pages/bindWXTimer/index?timer='+timerCode
          })
        }
      })
    } else {
      Taro.navigateTo({
        url: '/pages/bindWXTimer/index?timer='+timerCode
      })
    }
  }

  return <div className='qrcode-wrapper'>
    <CustomNoticeBar 
      text='绑定计时器仅当日有效，只有绑定微信才会记录到总排行榜'
    />
    <div className='timer-code'>{timerCode}</div>
    
  </div>
}

