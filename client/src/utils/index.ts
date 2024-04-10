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
    const aggregatedData: any = [];

    for (const timerNum in data) {
        if (data.hasOwnProperty(timerNum)) {
            const records = data[timerNum];
            // 按 lap_create_time 进行倒序排序
            records.sort((a, b) => new Date(b.lap_create_time.replace(/-/g, '/')).getTime() - new Date(a.lap_create_time.replace(/-/g, '/')).getTime());
            const bestRecord = records.slice().sort((a, b) => a.single_score - b.single_score)[0];
            const formattedRecords = records.map(record => {
                record.lapTime = formatMilliseconds(record.single_score);
                return record;
            });
            aggregatedData.push({
                timer_num: timerNum,
                nickName: bestRecord.nickName,
                avatar: bestRecord.avatar,
                gender: bestRecord.gender,
                bestScore: bestRecord.lapTime,
                bestScoreLapTime: bestRecord.lap_create_time,
                records: formattedRecords,
                totalLap: records.length
            });
        }
    }
    return aggregatedData;
}