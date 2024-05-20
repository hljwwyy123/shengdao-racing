import Taro from '@tarojs/taro'
import { ArrowRight, Cart } from '@nutui/icons-react-taro'
import { useEffect, useState } from 'react';
import "./suite-ad.less"
interface IProps {
  id: number
}

interface IAdConfig {
  isShow: boolean
  image: string[]
  text: string
  adId: number
}

const REQUEST_URL = "https://racing-7gxq1capbac7539a-1300165852.ap-shanghai.service.tcloudbase.com/article/v1.0/ad_config";

export default function SuiteAdBar(props: IProps) {
  const { id } = props;
  const [adInfo, setAdInfo] = useState<IAdConfig>();

  useEffect(() => {
    getAdInfo()
  }, []);

  const getAdInfo = async () => {
    const { data } = await Taro.request({
      url: REQUEST_URL,
      method: 'GET',
      data: {
        id
      }
    });
    const ad = data.data.find((el: any) => el.adId == id)
    if (ad && ad.isShow) {
      setAdInfo(ad)
    }
  }

  const gotoAd = () => {
    Taro.reportEvent('goto_ad_fromrank',{adId: adInfo?.adId, ad: adInfo?.text});
    Taro.navigateTo({
      url: '/pages/shop/index'
    });
  }
  if (!adInfo) return null
  return <div className='suite-ad' onClick={gotoAd}>
    <div className='img-container'>
      { adInfo?.image.map((e: any) => <img src={e} /> )}
    </div>
    <div className='ad-text'>{adInfo?.text}</div>
    <ArrowRight className='toggle-am-jump ml10' />
  </div>
}