import path from 'path'
import { readFileSync } from 'fs'

const __dirname = path.resolve()

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

export const checkIsLogin = (req, resolve) => {
    const { cookie } = req.headers || {}
    const { username, watcherToken } = getCookie(cookie)
    if (!username || !watcherToken) {
        resolve(returnMsg('登录用户已过期, 请重新登录', null, 405))
        return false
    }
    const userInfo = getCurrentUser(username, watcherToken)
    if (!userInfo) {
        resolve(returnMsg('未查找到当前用户, 请重新登录', null, 405))
        return false
    }
    return userInfo
}

// 验证用户是否存在
export const checkUserIsExist = (username) => {
    return getRealUserInfo(username)
}

// 获得当前用户信息
export const getCurrentUser = (username, watcherToken) => {
    const userInfo = getRealUserInfo(username)
    if (!userInfo) return null
    if (userInfo.watcherToken !== watcherToken) return null
    return userInfo
}

// 实时获得用户Token
export const getRealUserInfo = (username) => {
    const result = readFileSync(`${__dirname}/config/token.js`, 'utf-8')
    if (!result) return null
    if (!result.includes(username)) return null
    const resultArr = result.split(`"${username}":`)
    if (resultArr.length === 1) return null
    const infoArr = resultArr[1].split(`}`)[0]
    const userInfo = new Function(`return ${infoArr}}`)()
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
