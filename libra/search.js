const fs = require('fs')

const sidebarList = require('./sidebar.json')
const urlList = require('./exJson.json')
const tempList = []

// sidebarList.forEach(item => {
//   // console.log('---item', item.subMenus)
//   item.subMenus.forEach(i => {
//     const obj = {
//       parname: item.name,
//       name: i.name,
//       url: i.key
//     }
//     tempList.push(obj)
//   })
// })


sidebarList.forEach(item => {
  // console.log('---item', item.subMenus)
  let obj = {
    parName: item.name,
    subMenus: []
  }
  item.subMenus.forEach(i => {
    obj.subMenus.push({
      name: i.name,
      url: i.key
    })
  })
  tempList.push(obj)
})

fs.writeFile(`./handleSide.json`, JSON.stringify(tempList), 'utf-8', err => {
  if (err) throw err
  console.log('----成功')
})