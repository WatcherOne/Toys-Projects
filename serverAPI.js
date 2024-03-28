import { readFile, writeFile } from 'fs/promises'
import { exec } from 'child_process'
import { checkIsSignedIn, toGetPointCount } from './api.js'

export default async (req) => {
    // 因为 post 请求参数存在请求体里，直接用 req.body 获取不到，需要用到 body-parser
    // 或直接解析
    const { url } = req
    if (url === '/api/setCookie') {
        return setCookie(req)
    } else if (url === '/api/getProcess') {
        return getProcess(req)
    } else if (url === '/api/getLogs') {
        return getLogs(req)
    } else if (url === '/api/getCommon') {
        return getCommon(req)
    }
}

// 设置cookie
export const setCookie = async (req) => {
    return new Promise(resolve => {
        let cookie = ''
        req.setEncoding('utf-8')
        req.on('data', data => {
            const obj = JSON.parse(data)
            cookie = obj.cookie
        })
        req.on('end', async () => {
            const data = `export const COOKIE = '${cookie}'`
            await writeFile('./config.js', data)
            resolve(JSON.stringify({ code: 200, data: '更新Cookie成功' }))
        })
    })
}

// 获得进程列表
export const getProcess = async (req) => {
    return new Promise(resolve => {
        exec('pm2 list', (error, stdout, stderr) => {
            if (error) {
                console.error(`执行命令时失败: ${error}`)
                console.error(`错误问题: ${stderr}`)
                resolve(JSON.stringify({ code: 500, data: stderr }))
            } else {
                resolve(JSON.stringify({ code: 200, data: stdout }))
            }
        })
    })
}

// 获得日志文件内容
export const getLogs = async (req) => {
    return new Promise(resolve => {
        readFile('./logs.txt', 'utf-8').then(data => {
            resolve(JSON.stringify({ code: 200, data }))
        }).catch(err => {
            resolve(JSON.stringify({ code: 500, data: err }))
        })
    })
}

// 初始化获取数据
export const getCommon = async (req) => {
    const { data: isSigned } = await checkIsSignedIn() || {}
    const remianedPoint = await toGetPointCount()
    return JSON.stringify({ code: 200, data: { isSigned, remianedPoint } })
}
