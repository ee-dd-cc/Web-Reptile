const hotJson1 = require('./json/img/hotImg-1.json')
const hotJson2 = require('./json/img/hotImg-2.json')
const hotJson3 = require('./json/img/hotImg-3.json')
const loversJson = require('./json/img/loversImg.json')
const qunliaoJson = require('./json/img/qunliaoImg.json')
const doutuJson = require('./json/img/doutuImg.json')
const duirenJson = require('./json/img/duirenImg.json')
const emojiJson = require('./json/img/emojiImg.json')
const { writeFile, distinctList } = require('../utils/index.js')

let hotJson = [...hotJson1, ...hotJson2, ...hotJson3]
hotJson.forEach(item => {
  item.type = 'popular'
})
const aj = {
  "RECORDS": hotJson
}
// writeFile({
//   path: './json/dealImg/hot',
//   fileName: `hotJson`,
//   content: JSON.stringify(aj)
// })
// hotJson = distinctList({
//   list: hotJson,
//   key: 'aHref'
// })
const dealImgList = ({jsonList = [], count, fileName, path}) => {
  console.log('----jsonList----长度', jsonList.length)
  const length = jsonList.length
  let tempList = []
  let lastIndex = 0
  if(length < count) { // 处理的count 大于json的长度则直接写入
    writeFile({
      path,
      fileName: `${fileName}0-${length - 1}`,
      content: JSON.stringify(tempList)
    })
    return
  }
  jsonList.forEach((el, index) => {
    tempList.push(el)
    if ((index + 1) % count === 0) {
      writeFile({
        path,
        fileName: `${fileName}${index + 1 - count}-${index}`,
        content: JSON.stringify(tempList)
      })
      tempList = []
      lastIndex = index
    }
    if ((length - lastIndex) < count && index == lastIndex && (lastIndex + 1 < length)) {
      tempList = jsonList.splice(lastIndex + 1, length)
       writeFile({
        path,
        fileName: `${fileName}${lastIndex + 1}-${length - 1}`,
        content: JSON.stringify(tempList)
      })
    }
  })
}
// 处理当下流行
// dealImgList({
//   jsonList: hotJson,
//   count: 200,
//   path: './json/dealImg/hot',
//   fileName: ''
// })

// 处理情侣
// dealImgList({
//   jsonList: loversJson,
//   count: 200,
//   path: './json/dealImg/lovers',
//   fileName: ''
// })

// 处理群聊
// dealImgList({
//   jsonList: qunliaoJson,
//   count: 200,
//   path: './json/dealImg/qunliao',
//   fileName: ''
// })

// 处理斗图
// dealImgList({
//   jsonList: doutuJson,
//   count: 200,
//   path: './json/dealImg/doutu',
//   fileName: ''
// })

// 处理怼人
// dealImgList({
//   jsonList: duirenJson,
//   count: 200,
//   path: './json/dealImg/duiren',
//   fileName: ''
// })

// // 处理emoji
// dealImgList({
//   jsonList: emojiJson,
//   count: 200,
//   path: './json/dealImg/emoji',
//   fileName: ''
// })