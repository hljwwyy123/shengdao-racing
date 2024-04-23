import { useEffect, useState } from "react";
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { RichText } from "@tarojs/components";

const REQUEST_URL = 'https://racing-7gxq1capbac7539a-1300165852.ap-shanghai.service.tcloudbase.com/article/v1.0/trace_desc'

export default function TrackIntro() {
  const [atricleDomString, setAtricle] = useState<any>('');

  useEffect(() => {
    getData()
  }, [])

  useShareAppMessage(() => {
    return {
      title: '胜道赛道简介', // 分享标题
      path: '/pages/track/index', // 分享路径，通常为当前页面路径
    };
  });

  

  const getData = async () => {
    const { data } = await Taro.request({
      url: REQUEST_URL,
      method: 'GET'
    })
    setAtricle(data.data[0].desc)
  }

  return <div className="track-intro-wrapper">
    <RichText nodes={atricleDomString}/>
  </div>
}
