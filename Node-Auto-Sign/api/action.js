import axios from 'axios'
import { HEADERS } from './config.js'
import { isSignedIn, signIn, getPointCount, freeCheck, drawAPI, getActivityAPI } from './juejin.api.js'

// 检测是否已签到
export async function checkIsSignedIn (cookie) {
    const res = await axios({
        url: isSignedIn,
        method: 'get',
        headers: {
            ...HEADERS,
            cookie
        }
    })
    // data 为 true 则表示已签到
    return res && res.data && res.data.data
}

// 签到
export async function toSignIn (cookie) {
    const res = await axios({
        url: signIn,
        method: 'post',
        headers: {
            ...HEADERS,
            cookie
        }
    })
    // { data: true, err_msg: '' }
    return res && res.data
}

// 获得矿石数量
export async function toGetPointCount (cookie) {
    const res = await axios({
        url: getPointCount,
        method: 'get',
        headers: {
            ...HEADERS,
            cookie
        }
    })
    // data: 表示数量值
    return res && res.data && res.data.data
}

// 检查是否能免费抽奖次数
export async function checkIsFreeDraw (cookie) {
    const res = await axios({
        url: freeCheck,
        method: 'get',
        headers: {
            ...HEADERS,
            cookie
        }
    })
    return res && res.data && res.data.data && res.data.data.free_count
}

// 去抽奖
export async function toDraw (cookie) {
    const res = await axios({
        url: drawAPI,
        method: 'post',
        headers: {
            ...HEADERS,
            cookie
        }
    })
    // { lottery_name } 抽奖结果
    return res && res.data && res.data.data
}

// 获得活动list
export async function toGetActivity () {
    const res = await axios({
        url: getActivityAPI,
        method: 'post',
        data: {
            time_segments: ['running_competitions', 'history_competitions']
        },
        headers: HEADERS
    })
    return res && res.data && res.data.data
}
