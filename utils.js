export const getCurrentDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const date = today.getDate()
  return `${year}/${month > 9 ? month : `0${month}`}/${date > 9 ? date : `0${date}`}`
}

export const getCurrentTime = () => {
  const today = new Date()
  const hour = today.getHours()
  const minute = today.getMinutes()
  const second = today.getSeconds()
  return `${hour > 9 ? hour : `0${hour}`}:${minute > 9 ? minute : `0${minute}`}:${second > 9 ? second : `0${second}`}`
}
