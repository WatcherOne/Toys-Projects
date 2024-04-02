import userList from '../config/token.js'

// 封装返回前端数据结构统一
export const returnMsg = (msg = '成功', data = null, code = 200) => {
    return JSON.stringify({ code, data, msg })
}

// 获得 Cookie
export const getCookie = (cookieStr) => {
    if (!cookieStr) return {}
    let cookie = {}
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        cookie[key] = val
    })
    return { username: cookie.username, watcherToken: cookie.watcherToken }
}

// 验证用户是否存在
export const checkUserIsExist = (username) => {
    return userList[username]
}

// 获得当前用户信息
export const getCurrentUser = (username, watcherToken) => {
    const userInfo = userList[username]
    if (!userInfo) return null
    if (userInfo.watcherToken !== watcherToken) return null
    return userInfo
}

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
