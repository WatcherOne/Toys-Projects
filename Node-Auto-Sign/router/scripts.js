import path from 'path'
import { exec } from 'child_process'
import { returnMsg, checkIsLogin } from '../utils/common.js'

const __dirname = path.resolve()

// 开启脚本
export const startScript = async (req) => {
    return new Promise(resolve => {
        const userInfo = checkIsLogin(req, resolve)
        if (!userInfo) return
        const { username, hour = 8, minute = 0, second = 0 } = userInfo
        const commandName = `autoScript-${username}`
        exec(`pm2 show ${commandName}`, (error, stdout, stderr) => {
            if (error) {
                // 不存在进程则开启进程
                const { killed } = error
                if (killed) {
                    // 其他错误时
                    resolve(returnMsg(stderr, null, 500))
                } else {
                    exec(`pm2 start ${__dirname}/scripts/index.js --name ${commandName} -- ${username} ${hour} ${minute} ${second}`, (error2, stdout2, stderr2) => {
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
    return new Promise(resolve => {
        const userInfo = checkIsLogin(req, resolve)
        if (!userInfo) return
        const { username } = userInfo
        const commandName = `autoScript-${username}`
        exec(`pm2 show ${commandName}`, (error, stdout, stderr) => {
            if (error) {
                resolve(returnMsg('脚本未启动', null, 500))
            } else {
                exec(`pm2 delete ${commandName}`, (error2, stdout2, stderr2) => {
                    if (error2) {
                        resolve(returnMsg(stderr2, null, 500))
                    } else {
                        resolve(returnMsg('停止成功', null, 200))
                    }
                })
            }
        })
    })
}
