import React from 'react'
import { Empty } from "@nutui/nutui-react-taro"
import "./empty.less"
interface IProps {
  text?: string,
  image?: string
}

const DEFAULT_IMAGE = 'https://img.alicdn.com/imgextra/i2/O1CN017jWunu1KANjFuhbj2_!!6000000001123-2-tps-370-199.png'

export default function EmptyContent(props: IProps) {
  const { text = '无数据', image = DEFAULT_IMAGE } = props;
  return <div className="empty-content-wrapper">
    <Empty
      description={text}
      image={
        <img
          style={{width: "100%"}}
          src={image}
        />
      }
    />
  </div>
}