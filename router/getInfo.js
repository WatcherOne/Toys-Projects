import { checkIsSignedIn, toGetPointCount } from '../api/action.js'
import { returnMsg, getCookie, getCurrentUser } from '../utils/common.js'

// 首页获得基础信息
export const getInfo = async (req) => {
    return new Promise(async resolve => {
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
        // 查询是否已签到
        const isSigned = await checkIsSignedIn(userInfo.token)
        // 查询当前矿石数
        const remianedPoint = await toGetPointCount(userInfo.token)
        if (typeof isSigned === 'object') {
            resolve(returnMsg(isSigned.err_msg, null, isSigned.err_no))
        } else if (typeof remianedPoint === 'object') {
            resolve(returnMsg(remianedPoint.err_msg, null, remianedPoint.err_no))
        } else {
            resolve(returnMsg('', { isSigned, remianedPoint }))
        }
    })
}
