const dateFormat = (val) => {
  const ddd = new Date(+val)
  let fullYear = ddd.getFullYear()
  let month = ddd.getMonth() + 1
  let date = ddd.getDate()
  let hours = ddd.getHours()
  let minutes = ddd.getMinutes()
  let seconds = ddd.getSeconds()
  return `${fullYear}-${month}-${date} ${hours}:${minutes}`
}

module.exports = {
  dateFormat
}
