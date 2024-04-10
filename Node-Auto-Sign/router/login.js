import path from 'path'
import userList from '../config/token.js'
import { writeFileSync } from 'fs'
import { checkUserIsExist, returnMsg } from '../utils/common.js'

const __dirname = path.resolve()

// 登陆接口 - 主要为了 设置 Token 与 Email 信息 -- 新增 / 登陆一个用户
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
            const { info: fileContent, watcherToken } = handleLoginInfo(userInfo, loginForm)
            console.log('newToken', watcherToken)
            await writeFileSync(fileName, fileContent)
            res.setHeader('Access-Control-Allow-Credentials', 'true')
            res.setHeader('Set-Cookie', [`username=${username}`, `watcherToken=${watcherToken}`])
            // 用户名已存在时登陆 => 会重新生成watcherToken
            resolve(returnMsg())
        })
    })
}

function handleLoginInfo (originInfo, obj) {
    const { username, password, email } = obj
    // 生成一个唯一 token 来标识不同用户, 暂时没有校验唯一性
    const watcherToken = randomNumber(11)
    const newUserList = JSON.parse(JSON.stringify(userList))
    newUserList[username] = Object.assign({}, JSON.parse(JSON.stringify(originInfo)), {
        username,
        password,
        watcherToken
    }, email && { email })
    return {
        info: `export default ${JSON.stringify(newUserList)}`,
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
