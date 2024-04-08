import path from 'path'
import { open, close } from 'fs'
import { readFile } from 'fs/promises'
import { returnMsg, checkIsLogin } from '../utils/common.js'

const __dirname = path.resolve()

// 获得日志文件内容
export const getLogs = async (req) => {
    return new Promise(resolve => {
        const userInfo = checkIsLogin(req, resolve)
        if (!userInfo) return
        const { username } = userInfo
        const fileName = `${__dirname}/logs/${username}.logs.txt`
        // 创建文件
        open(fileName, 'wx', (err, fd) => {
            // 文件已存在
            if (err) {
                readFile(fileName, 'utf-8').then(data => {
                    resolve(returnMsg('', data))
                }).catch(err => {
                    resolve(returnMsg(err, null, 500))
                })
                return
            }
            // 文件被创建
            resolve(returnMsg('', ''))
            close(fd, (err) => {
                if (err) console.error(err)
            })
        })
        
    })
}
