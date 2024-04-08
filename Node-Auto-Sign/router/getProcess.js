import { exec } from 'child_process'
import { returnMsg, checkIsLogin } from '../utils/common.js'

// 获得进程列表
export const getProcess = async (req) => {
    return new Promise(resolve => {
        const userInfo = checkIsLogin(req, resolve)
        if (!userInfo) return
        const { username } = userInfo
        const commandName = `autoScript-${username}`
        exec(`pm2 list ${commandName}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行命令时失败: ${error}`)
                console.error(`错误问题: ${stderr}`)
                resolve(returnMsg(stderr, null, 500))
            } else {
                resolve(returnMsg('', stdout))
            }
        })
    })
}
