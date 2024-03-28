// 邮件相关配置

export const SENDER = {
    HOST: 'smtp.qq.com',
    PORT: 465,
    USER: '282739240@qq.com',  // 授权smtp邮箱地址
    PASS: ''    // 申请的授权码
}

export const RECIPIENT = {
    USER: '286154864@qq.com',
    SUBJECT: '掘金签到成功',
    DEFAULTMSG: `您于${new Date().toLocaleString()}, 在自动签到系统中签到成功`
}
