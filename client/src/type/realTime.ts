export type REAL_SCORE_ITEM = {
  timer_num: string
  last_lap_time: string
  nickName: string
  avatar: string
  gender: 0 | 1 | 2
  bestScore: string
  bestScoreLapTime: string
  records: SCORE_DETAIL_ITEM[]
  totalLap: number
}

export type SCORE_DETAIL_ITEM = {
  lapTime: string
  lap_create_time_hour: string

}