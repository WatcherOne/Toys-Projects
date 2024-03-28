import http from 'http'
import path from 'path'
// import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises'
import handleAPI from './serverAPI.js'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// 得到的是运行目录，并不是该文件的所在目录
const __dirname = path.resolve()

http.createServer(async (req, res) => {
    const { url } = req
    console.log(`当前请求接口: ${url}----------------------------------------`)
    if (url.endsWith('.css')) {
        const data = await readFile(`${__dirname}/public${url}`)
        res.end(data || '404')
    } else if (url.endsWith('.js')) {
        const data = await readFile(`${__dirname}/public${url}`)
        res.end(data || '404')
    } else if (url.startsWith('/api')) {
        const data = await handleAPI(req)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(data || JSON.stringify({ code: 404, msg: '404' }))
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        const data = await readFile(`${__dirname}/public/index.html`)
        res.end(data || '404')
    }
    // Todo:   /favicon.ico
}).listen(6600)

console.log(`服务启动成功\nlocal: http://localhost:6600/`)
