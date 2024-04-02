import userList from '../config/token.js'

// 封装返回前端数据结构统一
export const returnMsg = (msg = '成功', data = null, code = 200) => {
    return JSON.stringify({ code, data, msg })
}

// 获得 Cookie
export const getCookie = (cookieStr) => {
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

// 获得当前用户信息
export const getCurrentUser = (username, watcherToken) => {
    const userInfo = userList[username]
    if (!userInfo) return null
    if (userInfo.watcherToken !== watcherToken) return null
    return userInfo
}
