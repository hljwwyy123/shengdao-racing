import React from "react"
import {  NoticeBar } from "@nutui/nutui-react-taro"
import { Failure } from '@nutui/icons-react-taro'
import "./noticebar.less"
interface IProps {
  closeable?: boolean
  text: string
}
export default function CustomNoticeBar(props: IProps) {
  const { closeable, text } = props;
  return <NoticeBar 
    closeable={closeable}
    rightIcon={<Failure />}
  >{text}
  </NoticeBar>
}