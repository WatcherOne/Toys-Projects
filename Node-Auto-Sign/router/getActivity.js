import { toGetActivity } from '../api/action.js'
import { returnMsg, checkIsLogin } from '../utils/common.js'

export const getActivity = async (req) => {
    return new Promise(async resolve => {
        const userInfo = checkIsLogin(req, resolve)
        if (!userInfo) return
        const { token } = userInfo
        const data = await toGetActivity(token) || {}
        resolve(returnMsg('', data))
    })
}
