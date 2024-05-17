import moment from "moment";
import Taro from "@tarojs/taro"
import { REAL_SCORE_ITEM } from "../type/realTime";

export async function getOpenId () {
    let _openId = Taro.getStorageSync("openId");
    let _unionId = Taro.getStorageSync("unionId");
    if (!_openId) {
        const res: any = await Taro.cloud.callFunction({
        name: 'login'
        });
        _openId = res.result.openid
        _unionId = res.result.unionid
        Taro.setStorageSync("openId", _openId)
        Taro.setStorageSync("unionId", _unionId)
    }
    return {
        openId: _openId,
        unionId: _unionId
    }
}

export function randomScore() {
    return getRandomBetween(90000, 100000)
}

function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 将毫秒转换成分钟和秒的形式
export function formatMilliseconds(milliseconds) {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const remainingMilliseconds = milliseconds % 1000;

    let result = '';

    if (hours > 0) {
        result += `${hours}h`;
    }

    if (minutes > 0) {
        result += `${minutes}'`;
    }

    result += `${seconds}.${remainingMilliseconds.toString().padStart(3, '0')}`;

    return result;
}

export function aggregateRealTimeData(data) {
    const aggregatedData: REAL_SCORE_ITEM[] = [];

    for (const timerNum in data) {
        if (data.hasOwnProperty(timerNum)) {
            const records = data[timerNum];
            // 按 lap_create_time 进行倒序排序
            records.sort((a, b) => new Date(b.lap_create_time.replace(/-/g, '/')).getTime() - new Date(a.lap_create_time.replace(/-/g, '/')).getTime());
            const bestRecord = records.slice().sort((a, b) => a.single_score - b.single_score)[0];
            const formattedRecords = records.map(record => {
                record.lapTime = formatMilliseconds(record.single_score);
                record.lap_create_time_hour = moment(record.lap_create_time).format('HH:mm:ss')
                return record;
            });
            aggregatedData.push({
                timer_num: timerNum,
                last_lap_time: records[0].lap_create_time,
                nickName: bestRecord.nickName,
                avatar: bestRecord.avatar,
                gender: bestRecord.gender,
                displacement: bestRecord.displacement,
                carName: bestRecord.carName,
                group: bestRecord.group,
                bestScore: bestRecord.lapTime,
                single_score: bestRecord.single_score,
                bestScoreLapTime: bestRecord.lap_create_time_hour,
                records: formattedRecords,
                totalLap: records.length
            });
        }
    }
    aggregatedData.sort((a, b) => new Date(b.last_lap_time.replace(/-/g, '/')).getTime() - new Date(a.last_lap_time.replace(/-/g, '/')).getTime());
    return aggregatedData;
}

export function aggregateMyHistoryData(data) {
    const aggregatedData: REAL_SCORE_ITEM[] = [];

    for (const timerNum in data) {
        if (data.hasOwnProperty(timerNum)) {
            const records = data[timerNum];
            // 按 lap_create_time 进行倒序排序
            records.sort((a, b) => new Date(b.lap_create_time.replace(/-/g, '/')).getTime() - new Date(a.lap_create_time.replace(/-/g, '/')).getTime());
            const bestRecord = records.slice().sort((a, b) => a.single_score - b.single_score)[0];
            const formattedRecords = records.map(record => {
                record.lapTime = formatMilliseconds(record.single_score);
                record.lap_create_time_hour = moment(record.lap_create_time).format('HH:mm:ss')
                return record;
            });
            aggregatedData.push({
                timer_num: timerNum,
                last_lap_time: records[0].lap_create_time,
                nickName: bestRecord.nickName,
                avatar: bestRecord.avatar,
                gender: bestRecord.gender,
                bestScore: bestRecord.lapTime,
                single_score: bestRecord.single_score,
                bestScoreLapTime: bestRecord.lap_create_time_hour,
                records: formattedRecords,
                totalLap: records.length
            });
        }
    }
    aggregatedData.sort((a, b) => new Date(b.last_lap_time.replace(/-/g, '/')).getTime() - new Date(a.last_lap_time.replace(/-/g, '/')).getTime());
    return aggregatedData;
}