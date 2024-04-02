import path from 'path'
import userList from '../config/token.js'
import { writeFileSync } from 'fs'
import { returnMsg, getCookie, getCurrentUser } from '../utils/common.js'

const __dirname = path.resolve()

export const setToken = async (req) => {
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
        let tokenObj = {}
        req.setEncoding('utf-8')
        req.on('data', data => {
            tokenObj = JSON.parse(data) || {}
        })
        req.on('end', async () => {
            const fileContent = handleUserInfo(username, tokenObj)
            const fileName = `${__dirname}/config/token.js`
            await writeFileSync(fileName, fileContent)
            resolve(returnMsg())
        })
    })
}

function handleUserInfo (username, tokenObj) {
    const userInfo = userList[username] || {}
    userList[username] = Object.assign({}, userInfo, tokenObj)
    return `export default ${JSON.stringify(userList)}`
}
