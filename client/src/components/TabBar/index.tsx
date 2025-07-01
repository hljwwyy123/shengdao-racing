import React, { useState } from "react"
import { Tabs } from "@nutui/nutui-react-taro"
import "./tabbar.less"
interface IProps {
  tabList: string[]
  onTabChange: (e: any) => any,
  activeTab?: number
}


export default function TabBar(props: IProps) {
  const { tabList = [], onTabChange, activeTab } = props;
  return <Tabs 
    value={activeTab}
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