import { useEffect, useState } from 'react'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { Collapse, Image, PullToRefresh } from "@nutui/nutui-react-taro"
import { ArrowRight, ArrowDown } from '@nutui/icons-react-taro'
import EmptyContent from '../../components/EmptyContent'
import './index.less'
import { View } from '@tarojs/components'
import { formatMilliseconds } from '../../utils'

/**
 * 比赛列表页面
 * 展示所有比赛，点击展开后查询并展示该比赛的圈速成绩
 */
export default function Index() {
  // 比赛列表
  const [matchList, setMatchList] = useState<any[]>([]);
  // 当前展开的比赛
  const [activeCollspan, setActiveCollspan] = useState<string[]>([]);
  // 当前展开比赛的圈速成绩
  const [scoreList, setScoreList] = useState<any[]>([]);
  // 加载状态
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMatchList();
  }, []);

  useShareAppMessage(() => {
    return {
      title: '胜道巅峰榜',
      path: '/pages/match/index',
    };
  });

  // 获取比赛列表
  const getMatchList = async () => {
    try {
      setLoading(true);
      Taro.showLoading();
      const matchRes = await Taro.cloud.callFunction({
        name: 'query_match_list'
      });
      // 兼容云函数返回格式
      setMatchList(matchRes?.result?.data || []);
    } catch (error) {
      console.log(error);
      Taro.showModal({
        content: JSON.stringify(error)
      });
    } finally {
      Taro.hideLoading();
      setLoading(false);
    }
  };

  // 点击展开某个比赛，查询该比赛的圈速成绩
  const onCollspanChange = async (matchSeq: string | string[]) => {
    // 只允许单开
    const matchSeqStr = Array.isArray(matchSeq) ? matchSeq[matchSeq.length - 1] : matchSeq;
    setActiveCollspan([matchSeqStr]);
    const matchItem = matchList.find(item => item.match_seq === matchSeqStr);
    if (matchItem) {
      await getScoreList(matchItem);
    } else {
      setScoreList([]);
    }
  };

  // 查询某个比赛的圈速成绩
  const getScoreList = async (matchItem: any) => {
    try {
      Taro.showLoading({ title: '加载成绩...' });
      const scoreRes = await Taro.cloud.callFunction({
        name: 'query_score_from_match',
        data: {
          match_seq: matchItem.match_seq,
          match_type: matchItem.match_type
        }
      });
      setScoreList(scoreRes?.result || []);
    } catch (error) {
      setScoreList([]);
      Taro.showModal({
        content: JSON.stringify(error)
      });
    } finally {
      Taro.hideLoading();
    }
  };

  // 渲染比赛类型
  const renderMatchType = (type: any) => {
    if (String(type) === '1') return '圈速赛';
    if (String(type) === '2') return '排位赛';
    return type || '-';
  };

  // 渲染比赛时间
  const renderMatchTime = (record: any) => {
    // 假设有 match_time 字段
    if (record.match_time) return record.match_time;
    return '-';
  };

  // 渲染成绩列表
  const renderScoreList = () => {
    if (!scoreList.length) {
      return <div className="empty-score-list">暂无成绩</div>;
    }
    return (
      <div className='rank-item-record-list'>
        <div className='detail-item-th'>
          <div>Pos</div>
          <div>No</div>
          <div>Diver</div>
          <div className='detail-item-score'>Best Tm</div>
          <div className='detail-item-recordtime'>Laps</div>
        </div>
        {scoreList.map((item, idx) => (
          <div className='rank-item-detail-item' key={item.openId || idx}>
            <div>{idx + 1}</div>
            <div>{item.timer_num || '-'}</div>
            <div>{item.nickName || '-'}</div>
            <div className='detail-item-score'>
              {item.single_score ? formatMilliseconds(item.single_score) : (item.totalScore ? formatMilliseconds(item.totalScore) : '-')}
            </div>
            <div>{item.totalLap || (item.allLaps ? item.allLaps.length : '-')}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <View>
      <div className='index'>
        <PullToRefresh
          completeText=" "
          onRefresh={getMatchList}
          renderIcon={(status) => {
            return (
              <div>
                {(status === 'pulling' || status === 'complete') && (
                  <img
                    alt=""
                    style={{ height: '26px', width: '36px' }}
                    src="https://img10.360buyimg.com/imagetools/jfs/t1/230454/20/14523/223/65fab2d1F379c3968/ac35992443abab0c.png"
                  />
                )}
                {(status === 'canRelease' || status === 'refreshing') && (
                  <img
                    alt=""
                    style={{ height: '26px', width: '36px' }}
                    src="https://img.alicdn.com/imgextra/i3/O1CN01Hso8lx1rexUYpctvl_!!6000000005657-2-tps-48-48.png"
                  />
                )}
              </div>
            );
          }}
        >
          <div className='rank-th'>
            <div className='th-auto'>比赛</div>
            <div className='th-group'>类型</div>
            <div className='th-time'>比赛时间</div>
          </div>
          {!matchList.length && !loading && <EmptyContent text='暂无数据哦~' />}
          <Collapse
            activeName={activeCollspan}
            className='rank-list-container'
            onChange={onCollspanChange}
          >
            {matchList.map((record: any, index: number) => (
              <Collapse.Item
                name={record.match_seq}
                className='rank-item'
                key={record.match_seq}
                title={
                  <div className='rank-item-title'>
                    <div className='item-name'>
                      <div>{record.match_name || record.matchName || '-'}</div>
                    </div>
                  </div>
                }
                extra={
                  <div className='extra-cell'>
                    <div className='match-type'>{renderMatchType(record.match_type)}</div>                    
                    <div className='match-time'>
                      {record.create_time ? record.create_time.slice(0, 10) : '-'}
                    </div>
                    <div className='total-lap'>
                      {record.match_seq === activeCollspan[0] ? <ArrowDown /> : <ArrowRight />}
                    </div>
                  </div>
                }
              >
                {/* 只渲染当前展开项的成绩列表 */}
                {record.match_seq === activeCollspan[0] ? renderScoreList() : null}
              </Collapse.Item>
            ))}
          </Collapse>
        </PullToRefresh>
      </div>
    </View>
  );
}
