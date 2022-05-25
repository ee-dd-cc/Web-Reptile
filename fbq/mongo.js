/**
 * 处理mongo数据
 */
const emoticonJson = require('./json/emoticon/emoticon_all_list_yes.json')
const { writeFile, distinctList } = require('../utils/index.js')
let emoticonId = 999 // 表情包默认id
let emojiId  = 999 // 表情默认id
let tagId  = 999 // tag默认id

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
  const tagList = []
  dealList = distinctList({
    list: dealList,
    key: 'aHref'
  })
  dealList = dealList.map((item) => {
    delete item.count
    delete item.neighbor
    delete item._id
    delete item.id
    delete item.type
    emoticonId += 1
    item.imgList = item.imgList.map(el => {
      emojiId += 1
      el = {
        id: emojiId,
        pId: emoticonId,
        imgIndex: el.imgIndex,
        imgTitle: el.imgTitle,
        imgAlt: el.imgAlt,
        imgDes: el.imgDes,
        imgDataOriginal: el.imgDataOriginal,
        imgSrc: el.imgSrc || ''
      }
      tempEmojiList.push(el)
      return el
    })
    item.tagList = item.tagList.map(el => {
      tagId += 1
      el = {
        id: tagId,
        pId: emoticonId,
        ...el
      }
      tagList.push(el)
      return el
    })
    return {
      id: emoticonId,
      count:  item.imgList.length ? item.imgList.length : 0,
      type: 'popular',
      ...item
    }
  })
  console.log(`处理后的数据----${fileName}`, dealList.length)
  console.log(`得到的emoji的数据----tempEmojiList`, tempEmojiList.length)
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
  writeFile({
    path: './json/mongo',
    fileName: `${fileName}_tag_0-10`,
    content: JSON.stringify({
      RECORDS: tagList.filter((item, index) => index < 10)
    })
  })
  writeFile({
    path: './json/mongo',
    fileName: `${fileName}_tag`,
    content: JSON.stringify({
      RECORDS: tagList
    })
  })
}

dealEmoticon({
  dealList: emoticonJson,
  fileName: 'emoticon_list_deal'
})



