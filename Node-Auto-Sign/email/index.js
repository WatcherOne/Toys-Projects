import nodemailer from 'nodemailer'
import { SENDER, RECIPIENT } from './config.js'

const transporter = nodemailer.createTransport({
    host: SENDER.HOST,
    port: SENDER.PORT,
    secureConnection: true, // 不写这句会报错：Greeting never received
    auth: {
        user: SENDER.USER, 
        pass: SENDER.PASS  
    }
})

export const sendEmail = async (user, content = RECIPIENT.DEFAULTMSG) => {
    return await transporter.sendMail({
        from: SENDER.USER,          // 发送邮件的地址
        to: user,                   // 接收邮件的地址
        subject: RECIPIENT.SUBJECT, // 邮件标题
        text: content,              // 有 html，优先 html
        html: '',                   // html body
        attachments: ''             // 附件
    })
}
