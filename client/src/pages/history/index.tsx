import { useEffect, useState } from "react";
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { Collapse } from "@nutui/nutui-react-taro"
import { ArrowRight, ArrowDown } from '@nutui/icons-react-taro'
import EmptyContent from '../../components/EmptyContent'
import "./history.less"

export default function History() {
    const [rankList, setRankList] = useState<any>([]);

    const [activeCollspan, setActiveCollspan] = useState<string[]>([])

    useEffect(() => {
        getHistoryData()
    }, [])

    useShareAppMessage(() => {
        return {
          title: '我的胜道赛道成绩', // 分享标题
          path: '/pages/history/index', // 分享路径，通常为当前页面路径
        };
      });

    const getHistoryData = async () => {
        Taro.showLoading()
        const res = await Taro.cloud.callFunction({
            name: 'find_my_history',
        });
        console.log(res.result)
        setRankList(res.result)
        Taro.hideLoading()
    }

    const onCollspanChange = (
        activeName: string | string[],
    ) => {
        setActiveCollspan([activeName[activeName.length - 1]] as string[])
    }

    return <div>
        <div className='rank-list'>
            <div className='rank-th'>
                <div className='rank-no'>日期</div>
                <div className='rank-user'>圈速</div>
                <div className='rank-score'>总圈数</div>
            </div>
            { !rankList.length && <EmptyContent text='暂无数据哦~' />}
            <Collapse activeName={activeCollspan} className='rank-list-container' onChange={onCollspanChange}>
            {
              rankList.map((record: any) => <Collapse.Item 
                name={record.best.date}
                className='rank-item'
                title={<div className='rank-item-title'>
                  <div className='item-name'>
                    <div className="date-cell">{record.best.date}</div>
                    <div>{record.best.lapTime}</div>
                  </div>
                </div>}
                extra={
                  <div className='extra-cell'>
                    <div className='total-lap'><b>{record.list.length}</b>{ record.best.date === activeCollspan[0] ? <ArrowDown /> : <ArrowRight />}</div>
                  </div>
                }
              >
                  <div className='rank-item-record-list'>
                    <div className='detail-item-th'>
                        <div >序号</div>
                        <div className='detail-item-score'>成绩</div>
                        <div className='detail-item-recordtime'>记录时间</div>
                    </div>
                    {
                      record.list.map((detailItem: any, index: number) => <div className='rank-item-detail-item'>
                        <div className='detail-item-no'>{record.list.length - index}</div>
                        <div className='detail-item-score'>{detailItem.lapTime}</div>
                        <div>{detailItem.lap_create_time_hour}</div>
                      </div>)
                    }
                  </div>
              </Collapse.Item>
              )
            }
          </Collapse>
        </div>
    </div>
}