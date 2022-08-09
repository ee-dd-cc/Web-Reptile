/*
 * @Author: EdisonGu
 * @Date: 2022-08-08 14:00:23
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-08 20:03:02
 * @Descripttion: 
 */
const MOVIE_TYPE = name => {
  let type = 'other'
  switch (name) {
    case '首页':
      type = 'HOME'
      break;
    case '电影':
      type = 'movie'
      break;
    case '连续剧':
      type = 'TV'
      break;
    case '综艺':
      type = 'variety'
      break;
    case '动漫':
      type = 'cartoon'
      break;
    case '神片':
      type = 'godMovie'
      break;
    case '连续剧':
      type = 'TV'
      break;
    case '国产剧':
      type = 'CNTV'
      break;
    case '香港剧':
      type = 'HKTv'
      break;
    case '韩国剧':
      type = 'KRTV'
      break;
    case '欧美剧':
      type = 'USTV'
      break;
    case '台湾剧':
      type = 'TWTV'
      break;
    case '日本剧':
      type = 'JPTV'
      break;
    case '海外剧':
      type = 'OATV' // oversea
      break;
    default:
      break;
  }
  return type
}

const TRANS_NAME = key => {
  let str = ''
  switch (key) {
    case '别名':
      str = 'other_name'
      break;
    case '导演':
      str = 'director'
      break;
    case '主演':
      str = 'main_actor'
      break;
    case '类型':
      str = 'type'
      break;
    case '地区':
      str = 'area'
      break;
    case '语言':
      str = 'language'
      break;
    case '上映':
      str = 'release_year'
      break;
    case '更新':
      str = 'update_time'
      break;
    default:
      break;
  }
  return str
}

module.exports = {
  MOVIE_TYPE,
  TRANS_NAME
}
