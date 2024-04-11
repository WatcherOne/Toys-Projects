import { checkIsSignedIn, toGetPointCount } from '../api/action.js'
import { returnMsg, checkIsLogin } from '../utils/common.js'

// 首页获得基础信息
export const getInfo = async (req) => {
    return new Promise(async resolve => {
        const userInfo = checkIsLogin(req, resolve)
        if (!userInfo) return
        const { token, email, hour, minute, second } = userInfo
        if (!token) {
            resolve(returnMsg('请先设置掘金 Token', null, 403))
            return
        }
        // 查询是否已签到
        const isSigned = await checkIsSignedIn(token)
        // 查询当前矿石数
        const remianedPoint = await toGetPointCount(token)
        const rebackParams = { token, email, hour, minute, second }
        if (typeof isSigned === 'object') {
            resolve(returnMsg(`当前Token不可用, 请确认Token是否正确`, rebackParams, isSigned.err_no))
        } else if (typeof remianedPoint === 'object') {
            resolve(returnMsg(`当前Token不可用, 请确认Token是否正确`, rebackParams, remianedPoint.err_no))
        } else {
            resolve(returnMsg('', { isSigned, remianedPoint, ...rebackParams }))
        }
    })
}
