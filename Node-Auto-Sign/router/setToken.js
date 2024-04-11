import path from 'path'
import userList from '../config/token.js'
import { writeFileSync } from 'fs'
import { returnMsg, checkIsLogin } from '../utils/common.js'

const __dirname = path.resolve()

// 设置 Token，时间，邮箱都放在同一个接口了
export const setToken = async (req) => {
    return new Promise(resolve => {
        const userInfo = checkIsLogin(req, resolve)
        let params = {}
        req.setEncoding('utf-8')
        req.on('data', data => {
            params = JSON.parse(data) || {}
        })
        req.on('end', async () => {
            if (!params.token) {
                resolve(returnMsg('token不可为空', null, 500))
                return
            }
            const fileContent = handleUserInfo(userInfo || {}, params)
            const fileName = `${__dirname}/config/token.js`
            await writeFileSync(fileName, fileContent)
            resolve(returnMsg())
        })
    })
}

function handleUserInfo (userInfo, params) {
    const { username } = userInfo
    const { token, email } = params
    let { hour, minute, second } = params
    hour = isNaN(+hour) ? '8' : (+hour || '8')
    minute = isNaN(+minute) ? '0' : (+minute || '0')
    second = isNaN(+second) ? '0' : (+second || '0')
    userList[username] = Object.assign({}, userInfo, {
        token, hour, minute, second
    }, email && { email })
    return `export default ${JSON.stringify(userList)}`
}
