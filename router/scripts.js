import { exec } from 'child_process'
import { returnMsg, getCookie, getCurrentUser } from '../utils/common.js'

// 开启脚本
export const startScript = async (req) => {
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
        const commandName = `autoScript-${username}`
        exec(`pm2 show ${commandName}`, (error, stdout, stderr) => {
            if (error) {
                // 不存在进程则开启进程
                const { killed } = error
                if (killed) {
                    // 其他错误时
                    resolve(returnMsg(stderr, null, 500))
                } else {
                    exec(`pm2 start index.js --name ${commandName} -- zhubo`, (error2, stdout2, stderr2) => {
                        if (error2) {
                            resolve(returnMsg(stderr2, null, 500))
                        } else {
                            resolve(returnMsg('启动成功'))
                        }
                    })
                }
            } else {
                resolve(returnMsg('脚本已开启，请停止后再开启', null, 500))
            }
        })
    })
}

// 停止脚本
export const stopScript = async (req) => {

}
