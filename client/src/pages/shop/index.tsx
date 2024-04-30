import { useEffect, useState } from "react";
import Taro, { useShareAppMessage } from '@tarojs/taro'
import RichText from "../../components/RichText";
import "./shop.less"

const REQUEST_URL = 'https://racing-7gxq1capbac7539a-1300165852.ap-shanghai.service.tcloudbase.com/article/v1.0/shop_desc'
const GOOD_URL = 'https://racing-7gxq1capbac7539a-1300165852.ap-shanghai.service.tcloudbase.com/article/v1.0/good_list'

export default function ShopIntro() {
  const [atricleDomString, setAtricle] = useState<any>('');
  const [qrCode, setQRCode] = useState<string>('');
  const [goodList, setGoodList] = useState<any[]>([])

  useEffect(() => {
    getData()
  }, [])

  useShareAppMessage(() => {
    return {
      title: '工厂直销赛道装备', // 分享标题
      path: '/pages/shop/index', // 分享路径，通常为当前页面路径
      imageUrl: 'https://img.alicdn.com/imgextra/i3/O1CN011uXlf21yf8y0WlbaF_!!6000000006605-0-tps-1116-1007.jpg'
    };
  });

  

  const getData = async () => {
    Taro.showLoading()
    const { data } = await Taro.request({
      url: REQUEST_URL,
      method: 'GET'
    });
    const goodRes = await Taro.request({
      url: GOOD_URL,
      method: 'GET'
    })
    console.log({data, goodRes})
    const { shop_desc, qrcode} = data.data[0];
    setAtricle(shop_desc)
    setQRCode(qrcode)
    setGoodList(goodRes.data.data)
    Taro.hideLoading()
  }
  console.log({goodList})

  return <div className="shop-intro-wrapper">
    <div className="good-list-container">
      {
        goodList.map((item: any) => <div className="good-item">
          <div className="good-info">
            <span className="good-name">{item.name}</span>
            <span className="good-price">{item.price}</span>
          </div>
          {
            item?.good_image && 
            <div className="img-wrapper">
              {
                item?.good_image.map((img: string)=> <img className="good-img"
                      src={img} 
                      onClick={() => Taro.previewImage({
                        current: img,
                        urls: item?.good_image
                      })} />
                )
              }
            </div>
          }
        </div>)
      }
    </div>
    <RichText nodes={atricleDomString} />
    <img src={qrCode} className="shop-qrcode" onClick={() => Taro.previewImage({
      current: qrCode,
      urls: [qrCode]
    })} />
  </div>
}
