import axios from 'axios'
import { getCurrentDate, getCurrentTime } from './utils.js'
import { headers } from './config.js'
import { isSignIn, signIn, getPointCount, freeCheck, drawAPI } from './config.api.js'
import { sendEmail } from './sendEmail.js'
import schedule from 'node-schedule'

const message = {
    signStatus: '',   // 签到情况
    pointCount: 0,    // 当前矿石数量
    drawStatus: ''    // 抽奖情况
}

async function checkIsSignedIn () {
    const res = await axios({
        url: isSignIn,
        method: 'get',
        headers
    })
    return res && res.data
}

async function toSignIn () {
    const res = await axios({
        url: signIn,
        method: 'post',
        headers
    })
    return res && res.data
}

async function toGetPointCount () {
    const res = await axios({
        url: getPointCount,
        method: 'get',
        headers
    })
    return res && res.data && res.data.data
}

async function checkIsFreeDraw () {
    return new Promise(resolve => {
        // 延迟10s再查询 以防止签到没更新
        setTimeout(async () => {
            const res = await axios({
                url: freeCheck,
                method: 'get',
                headers
            })
            resolve(res && res.data && res.data.data && res.data.data.free_count)
        }, 10000)
    })
}

async function toDraw () {
    const res = await axios({
        url: drawAPI,
        method: 'post',
        headers
    })
    return res && res.data && res.data.data
}

async function toSendEmail () {
    const { signStatus, pointCount, drawStatus } = message
    const msg = `当前日期: ${getCurrentDate()} ${getCurrentTime()}\n签到情况: ${signStatus}\n矿石数: ${pointCount}\n抽奖情况: ${drawStatus}`
    return await sendEmail()
}

async function main () {
    console.log(`\n\n---------------------${getCurrentDate()} ${getCurrentTime()}---------------------\n`)
    console.log(`-------------------------是否已签到-------------------------`)
    const isSignedObj = await checkIsSignedIn()
    if (isSignedObj.data) {
        console.log(`\n今日已签到\n`)
        message.signStatus = '今日已签到'
    } else {
        console.log(`\n正在签到...`)
        const signStatusObj = await toSignIn()
        if (signStatusObj.data) {
            console.log(`签到成功\n`)
            message.signStatus = '签到成功'
        } else {
            console.log(`${signStatusObj.err_msg}\n`)
            message.signStatus = signStatusObj.err_msg || '签到失败'
        }
    }
    console.log(`-------------------------当前矿石数-------------------------`)
    const count = await toGetPointCount()
    console.log(`\n矿石数: ${count}\n`)
    message.pointCount = count || 0
    console.log(`-------------------------免费抽奖次数-------------------------`)
    const times = await checkIsFreeDraw()
    if (times) {
        console.log(`\n免费抽奖次数: ${times}`)
        console.log(`开始抽奖...`)
        const { lottery_name } = await toDraw()
        console.log(`您获得${lottery_name}\n`)
        message.drawStatus = `获奖结果：${lottery_name}\n`
    } else {
        console.log(`\n免费抽奖次数已用完\n`)
        message.drawStatus = '免费抽奖次数已用完'
    }
    console.log(`-------------------------发送邮件通知-------------------------`)
    const emailResult = await toSendEmail()
    if (emailResult.messageId) {
        console.log(`\n邮件发送成功, 邮件ID: ${emailResult.messageId}\n`)
    } else {
        console.log(`\n邮件发送失败, 请检查邮箱配置\n`)
    }
}

const task = () => {
    // 每天早上8点触发
    const rule = new schedule.RecurrenceRule()
    rule.hour = 8
    rule.minute = 0
    rule.second = 0
    schedule.scheduleJob(rule, main)
}

task()
