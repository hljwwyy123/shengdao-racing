import { useEffect, useState } from "react";
import Taro, { useShareAppMessage } from '@tarojs/taro'
import RichText from "../../components/RichText";
import "./activity.less"

const REQUEST_URL = 'https://racing-7gxq1capbac7539a-1300165852.ap-shanghai.service.tcloudbase.com/article/v1.0/activity'

export default function ActivityIntro() {
  const [atricleDomString, setAtricle] = useState<any>('');

  useEffect(() => {
    getData()
  }, [])

  useShareAppMessage(() => {
    return {
      title: '胜道赛道活动', // 分享标题
      path: '/pages/activity/index', // 分享路径，通常为当前页面路径
    };
  });

  

  const getData = async () => {
    Taro.showLoading()
    const { data } = await Taro.request({
      url: REQUEST_URL,
      method: 'GET'
    });
    setAtricle(data.data[0].activity)
    Taro.hideLoading()
  }

  return <div className="activity-intro-wrapper">
    <RichText nodes={atricleDomString} />
  </div>
}
