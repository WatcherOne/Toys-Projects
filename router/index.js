import { login } from './login.js'
import { getInfo } from './getInfo.js'
import { getLogs } from './getLogs.js'
import { startScript } from './scripts.js'

export default async (req, res) => {
    // 因为 post 请求参数存在请求体里，直接用 req.body 获取不到，需要用到 body-parser
    // 或直接解析
    const { url } = req
    switch (url) {
        case '/api/login': return login(req, res);
        case '/api/getInfo': return getInfo(req);
        case '/api/getLogs': return getLogs(req);
        case '/api/startScript': return startScript(req);
        // case '/api/stopScript': return stopScript(req);
    }
    // } else if (url === '/api/getProcess') {
    //     return getProcess(req)
    // } else if (url === '/api/getActivity') {
    //     return getActivity(req)
    // }
}
