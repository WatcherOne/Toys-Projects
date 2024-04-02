import http from 'http'
import path from 'path'
// import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises'
import handleRouter from './router/index.js'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// 得到的是运行目录，并不是该文件的所在目录
const __dirname = path.resolve()

http.createServer(async (req, res) => {
    const { url } = req
    console.log(`当前请求接口: ${url}----------------------------------------`)

    if (url.startsWith('/api')) {
        const data = await handleRouter(req, res)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(data)
    } else {
        const extname = path.extname(url)
        let contentType = 'text/html'
        switch (extname) {
            case '.js': contentType = 'text/javascript'; break;
            case '.css': contentType = 'text/css'; break;
            case '.json': contentType = 'application/json'; break;
            case '.png': contentType = 'image/png'; break;
            case '.jpg':
            case '.jpeg': contentType = 'image/jpeg'; break;
            // '.ico' Todo: /favicon.ico
        }
        readFile(`${__dirname}/public${url}`).then(content => {
            res.writeHead(200, { 'Content-Type': contentType })
            res.end(content, 'utf-8')
        }).catch(err => {
            if (url === '/') {
                readFile(`${__dirname}/public/index.html`).then(content => {
                    res.writeHead(200, { 'Content-Type': contentType })
                    res.end(content, 'utf-8')
                })
            } else {
                res.writeHead(500)
                res.end(`Server Error ${err.code}`)
            }
        })
    }
}).listen(6600)

console.log(`服务启动成功\nlocal: http://localhost:6600/`)
