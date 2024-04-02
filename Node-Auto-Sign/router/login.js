import path from 'path'
import userList from '../config/token.js'
import { writeFileSync } from 'fs'
import { checkUserIsExist, returnMsg } from '../utils/common.js'

const __dirname = path.resolve()

// 登陆接口 - 主要为了 设置 Token 与 Email 信息 - 开启一个全新的自动签到脚本
export const login = async (req, res) => {
    return new Promise(resolve => {
        let loginForm = {}
        req.setEncoding('utf-8')
        req.on('data', data => {
            loginForm = JSON.parse(data) || {}
        })
        req.on('end', async () => {
            const { username, password } = loginForm
            if (!username || !password) {
                resolve(returnMsg('账号名或密码不可为空', null, 500))
                return
            }
            if (!/^[A-Za-z0-9]+$/.test(username)) {
                resolve(returnMsg('账号名只能包含英文与数字', null, 500))
                return
            }
            const userInfo = checkUserIsExist(username)
            if (userInfo && userInfo.password !== password) {
                resolve(returnMsg('密码不正确', null, 500))
                return
            }
            const fileName = `${__dirname}/config/token.js`
            const { info: fileContent, watcherToken } = handleLoginInfo(loginForm)
            await writeFileSync(fileName, fileContent)
            res.setHeader('Access-Control-Allow-Credentials', 'true')
            res.setHeader('Set-Cookie', [`username=${username}`, `watcherToken=${watcherToken}`])
            // 用户名已存在时 => 会替换
            resolve(returnMsg())
        })
    })
}

function handleLoginInfo (obj) {
    const { username, password, email } = obj
    const watcherToken = randomNumber(11)
    userList[username] = { username, password, email, watcherToken: watcherToken }
    return {
        info: `export default ${JSON.stringify(userList)}`,
        watcherToken
    }
}

function randomNumber (length) {
    let result = ''
    for (let i = 0; i < length; i++) {
        result += Math.ceil(Math.random() * 10)
    }
    return result
}
