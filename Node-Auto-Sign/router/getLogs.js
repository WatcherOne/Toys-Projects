import path from 'path'
import { readFile } from 'fs/promises'
import { returnMsg, getCookie, getCurrentUser } from '../utils/common.js'

const __dirname = path.resolve()

// 获得日志文件内容
export const getLogs = async (req) => {
    return new Promise(resolve => {
        const { cookie } = req.headers || {}
        const { username, watcherToken } = getCookie(cookie)
        if (!username || !watcherToken) {
            resolve(returnMsg('登录用户已过期, 请重新登录', null, 403))
            return
        }
        const userInfo = getCurrentUser(username, watcherToken)
        if (!userInfo) {
            resolve(returnMsg('未查找到当前用户, 请重新登录', null, 403))
            return
        }
        const fileName = `${__dirname}/logs/${username}.logs.txt`
        readFile(fileName, 'utf-8').then(data => {
            resolve(returnMsg('', data))
        }).catch(err => {
            resolve(returnMsg(err, null, 500))
        })
    })
}
