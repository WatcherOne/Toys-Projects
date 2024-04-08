import path from 'path'
import userList from '../config/token.js'
import { writeFileSync } from 'fs'
import { returnMsg, checkIsLogin } from '../utils/common.js'

const __dirname = path.resolve()

export const setTime = async (req) => {
    return new Promise(resolve => {
        const userInfo = checkIsLogin(req, resolve)
        if (!userInfo) return
        let fixedTime = {}
        req.setEncoding('utf-8')
        req.on('data', data => {
            fixedTime = JSON.parse(data) || {}
        })
        req.on('end', async () => {
            const fileContent = handleUserInfo(username, fixedTime)
            const fileName = `${__dirname}/config/token.js`
            await writeFileSync(fileName, fileContent)
            resolve(returnMsg())
        })
    })
}

function handleUserInfo (username, fixedTime) {
    const userInfo = userList[username] || {}
    userList[username] = Object.assign({}, userInfo, fixedTime)
    return `export default ${JSON.stringify(userList)}`
}
