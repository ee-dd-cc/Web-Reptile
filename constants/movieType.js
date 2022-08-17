/*
 * @Author: EdisonGu
 * @Date: 2022-08-08 14:00:23
 * @LastEditors: EdisonGu
 * @LastEditTime: 2022-08-17 14:57:53
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
    case '动作片':
      type = 'action'
      break;
    case '喜剧片':
      type = 'comedy'
      break;
    case '爱情片':
      type = 'romance'
      break;
    case '科幻片':
      type = 'scienceFiction'
      break;
    case '恐怖片':
      type = 'HorrorFilm'
      break;
    case '剧情片':
      type = 'drama'
      break;
    case '战争片':
      type = 'WarFilm'
      break;
    case '犯罪片':
      type = 'crimeFilm'
      break;
    case '记录片':
      type = 'documentaryFilm'
      break;
    case '动漫电影':
      type = 'animationFilm'
      break;
    case '奇幻片':
      type = 'fantasyFilm'
      break;
    case '伦理片':
      type = 'ethicsFilm'
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
