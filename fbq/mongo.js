// const pJson = require('./json/mongo/ddd.json')
// const cJson = require('./json/mongo/emoji_list_gyk.json')
/**
 * 处理mongo数据
 */
// const emojiJson = require('./json/mongo/emoji_list.json')
const hotJson = require('./json/dealImg/hot/hotJson.json')
const { writeFile, distinctList } = require('../utils/index.js')
let emoticonId = 999 // 表情包默认id
let emojiId  = 999 // 表情默认id

let hotList = hotJson.RECORDS
// child的表的_id赋值parent的imglist下
const bindId = ({parentList, childList, fileName = 'mongoJson'}) => {
  parentList.forEach((pItem, pIndex) => {
    if (pIndex < 10) {
      const imgList = JSON.parse(pItem.imgList)
      imgList.forEach(imgItem => {
        childList.forEach(cItem => {
          if(pItem._id == cItem.p_id && imgItem.imgIndex == cItem.imgIndex) {
            imgItem._id = cItem._id
          }
        })
      })
      pItem.imgList = imgList
    }
  })
  const mongoJson = {
    RECORDS: parentList.splice(0, 10)
  }
  writeFile({
    path: './json/mongo',
    fileName,
    content: JSON.stringify(mongoJson)
  })
}
// 根据传入json的imgList字段，生成新数组
const saveImgChild = ({parentList, fileName}) => {
  const childJson = { RECORDS: [] }
  parentList.forEach((item, index) => {
    // if (index === 0) {
      const imgList = JSON.parse(item.imgList)
      imgList.forEach(imgItem => {
        imgItem.p_id = item._id
        childJson.RECORDS.push(imgItem)
      })
    // }
  })
  writeFile({
    path: './json/mongo',
    fileName,
    content: JSON.stringify(childJson)
  })
}

// saveImgChild({
//   parentList: emoticonList,
//   fileName: 'emoji_list'
// })

// bindId({
//   parentList: emoticonList,
//   childList: emojiList
// })
/**
 * 处理表情包库的数据，去重/生成表情包自增id/生成表情自增id/将所有图片生成emojiList
 */
const dealEmoticon = ({ dealList, fileName }) => {
  console.log('----hotJson', dealList.length)
  const tempEmojiList = []
  dealList = distinctList({
    list: dealList,
    key: 'aHref'
  })
  dealList.forEach((item, index) => {
    delete item.conut
    delete item.neighbor
    delete item._id
    item.count = item.imgList.length ? item.imgList.length : 0
    emoticonId += 1
    item.id = emoticonId
    if(!item.type) {
      console.log('----没有type')
      item.type = 'popular'
    }
    item.imgList.forEach((el, elIndex) => {
      emojiId += 1
      el = {
        id: emojiId,
        pId: item.id,
        ...el
      }
      tempEmojiList.push(el)
    })
  })
  console.log(`处理后的数据----${fileName}`, dealList.length)
  console.log(`得到的emoji的数据----tempEmojiList`, tempEmojiList.length)
  const delList = 
  writeFile({
    path: './json/mongo',
    fileName: `${fileName}_0-10`,
    content: JSON.stringify({
      RECORDS: dealList.filter((item, index) => index < 10)
    })
  })
  writeFile({
    path: './json/mongo',
    fileName,
    content: JSON.stringify({
      RECORDS: dealList
    })
  })
  writeFile({
    path: './json/mongo',
    fileName: `${fileName}_emoji_0-10`,
    content: JSON.stringify({
      RECORDS: tempEmojiList.filter((item, index) => index < 10)
    })
  })
  writeFile({
    path: './json/mongo',
    fileName: `${fileName}_emoji`,
    content: JSON.stringify({
      RECORDS: tempEmojiList
    })
  })
}

dealEmoticon({
  dealList: hotList,
  fileName: 'hot_list_deal'
})



