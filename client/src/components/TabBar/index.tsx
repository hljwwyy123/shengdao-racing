import React, { useState } from "react"
import { Tabs } from "@nutui/nutui-react-taro"
import "./tabbar.less"
interface IProps {
  tabList: string[]
  onTabChange: (e: any) => any
}


export default function TabBar(props: IProps) {
  const { tabList = [], onTabChange } = props;
  return <Tabs 
    duration={0}
    onChange={(value) => {
      onTabChange(value)
    }}
  >
    {
      tabList.map((tab: any) => <Tabs.TabPane title={tab}>
      </Tabs.TabPane>)
    }
  </Tabs>
}