import path from 'path'
import fs from 'fs'
import userList from '../config/token.js'
import { getCurrentDate, getCurrentTime } from '../utils/common.js'
import { checkIsSignedIn, toSignIn, toGetPointCount, checkIsFreeDraw, toDraw } from '../api/action.js'
import { sendEmail } from '../email/index.js'
import schedule from 'node-schedule'

const __dirname = path.resolve()

const EMAIL_MSG = {
    signStatus: '',   // 签到情况
    pointCount: 0,    // 当前矿石数量
    drawStatus: ''    // 抽奖情况
}
const LOG_MSG = {
    currentTime: '',   // 当前时间
    signStatus: null,  // 是否签到标识: true: 已签到  false: 未签到
    signResult: null,  // 签到结果：true: 签到成功，false: 签到失败，其它签到失败原因 
    remainedPoint: 0,  // 剩余矿石数
    freeDrawTimes: 0,  // 免费抽奖次数
    drawResult: null,  // 抽奖结果
    emailStatus: null, // 邮件发送状态：true: 发送成功，false: 发送失败
    error: null        // 错误信息
}

const username = process.argv[2] || ''
const userInfo = userList[username] || {}
const { hour = '8', minute = '0', second = '0', email } = userInfo
const COOKIE = userInfo.token || ''
console.log(username, hour, minute, second, email)

// 延迟去获取免费抽奖次数
async function queryFreeTimes () {
    return new Promise(resolve => {
        // 延迟10s再查询 以防止签到没更新
        setTimeout(async () => {
            resolve(await checkIsFreeDraw(COOKIE))
        }, 10000)
    })
}

function handleEmailMessage () {
    const { signStatus, pointCount, drawStatus } = EMAIL_MSG
    return `当前用户: ${username}\n执行日期: ${getCurrentDate()} ${getCurrentTime()}\n签到情况: ${signStatus}\n矿石数量: ${pointCount}\n抽奖情况: ${drawStatus}`
}

async function toLog () {
    fs.appendFileSync(`${__dirname}/logs/${username}.logs.txt`, `${JSON.stringify(LOG_MSG)}@\n`)
}

async function main () {
    LOG_MSG.currentTime = `${getCurrentDate()} ${getCurrentTime()}`
    if (!username || !COOKIE) {
        LOG_MSG.error = '用户不存在，脚本执行失败'
        await toLog()
        return
    }
    const isSignedObj = await checkIsSignedIn(COOKIE)
    console.log('isSignedObj', isSignedObj)
    if (isSignedObj) {
        const { err_no, err_msg } =isSignedObj
        if (err_no ===  403 || err_msg === 'must login') {
            LOG_MSG.error = '当前Token登录失败, 请重新设置正确的Token'
            toLog()
            // Todo: 关闭脚本？
            return
        } else {
            LOG_MSG.signStatus = true
            EMAIL_MSG.signStatus = '今日已签到'
        }
    } else {
        const signStatusObj = await toSignIn(COOKIE)
        if (signStatusObj.data) {
            LOG_MSG.signResult = 'true'
            EMAIL_MSG.signStatus = '签到成功'
        } else {
            LOG_MSG.signResult = signStatusObj.err_msg || 'false'
            EMAIL_MSG.signStatus = signStatusObj.err_msg || '签到失败'
        }
    }
    const count = await toGetPointCount(COOKIE)
    LOG_MSG.remainedPoint = count || 0
    EMAIL_MSG.pointCount = count || 0
    const times = await queryFreeTimes(COOKIE)
    if (times) {
        LOG_MSG.freeDrawTimes = times
        const { lottery_name } = await toDraw(COOKIE)
        LOG_MSG.drawResult = lottery_name
        EMAIL_MSG.drawStatus = `${lottery_name}\n`
    } else {
        LOG_MSG.freeDrawTimes = 0
        EMAIL_MSG.drawStatus = '今日免费抽奖次数已用完'
    }
    if (email) {
        const emailResult = await sendEmail(email, handleEmailMessage())
        LOG_MSG.emailStatus = emailResult.messageId ? true : false
    }
    toLog()
}

const task = () => {
    // 每天早上8点触发
    const rule = new schedule.RecurrenceRule()
    rule.hour = hour
    rule.minute = minute
    rule.second = second
    schedule.scheduleJob(rule, main)
}

console.log('-------------')
// task()
main()
