import { login } from './login.js'
import { setToken } from './setToken.js'
import { setTime } from './setTime.js'
import { getInfo } from './getInfo.js'
import { getLogs } from './getLogs.js'
import { getProcess } from './getProcess.js'
import { getActivity } from './getActivity.js'
import { startScript, stopScript } from './scripts.js'

export default async (req, res) => {
    // 因为 post 请求参数存在请求体里，直接用 req.body 获取不到，需要用到 body-parser
    // 或直接解析
    const { url } = req
    switch (url) {
        case '/api/login': return login(req, res);
        case '/api/setToken': return setToken(req);
        case '/api/setTime': return setTime(req);
        case '/api/getInfo': return getInfo(req);
        case '/api/getLogs': return getLogs(req);
        case '/api/getProcess': return getProcess(req);
        case '/api/startScript': return startScript(req);
        case '/api/stopScript': return stopScript(req);
        case '/api/getActivity': return getActivity(req);
    }
}
