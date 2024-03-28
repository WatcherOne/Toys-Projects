### Node-Auto-Sign

- node自动签到脚本
- node: 20.4.0+
- [测试地址](121.40.162.32:6600)

> 相关依赖

<table>
    <tbody>
        <tr>
            <td>nodemon</td>
            <td>热更新代码</td>
            <td>全局安装，nodemon index.js 来运行应用</td>
        </tr>
        <tr>
            <td>pm2</td>
            <td>进程管理</td>
            <td>全局安装，npm install pm2 -g</td>
        </tr>
        <tr>
            <td>node-schedule</td>
            <td>定时任务器</td>
            <td>pnpm install node-schedule --save / -S</td>
        </tr>
        <tr>
            <td>nodemailer</td>
            <td>发送邮件</td>
            <td>pnpm install nodemailer --save / -S</td>
        </tr>
        <tr>
            <td>axios</td>
            <td>发送请求</td>
            <td>pnpm install axios --save / -S</td>
        </tr>
    <tbody>
</table>

-----

> pm2 管理进程（是一款优秀的Node进程管理工具）

1. 安装与更新

    - 安装：npm install pm2 -g
    - 版本：pm2 -v
    - 更新：pm2 updated

2. 常用命令

    - 启动应用程序：pm2 start [entry]  // entry：入口文件
    - 启动设置名称：pm2 start [entry] --name [name]  // 可以设置进程的名称
    - 停止应用进程：pm2 stop [name] / [ID]  // 通过应用名或应用ID关闭指定应用
    - 停止所有进程：pm2 stop all
    - 重新启动进程：pm2 restart [name] / [ID]  // 通过应用名或应用ID重启指定应用
    - 重启所有进程：pm2 restart all // 短时间内服务不可用。生成环境推荐使用reload
    - 重载应用进程：pm2 reload [name] / [ID]  // 通过应用名或应用ID重载指定应用
    - 重载所有进程：pm2 reload all
    - 删除应用进程：pm2 delete [name] / [ID]  // 通过应用名或应用ID删除指定应用
    - 删除所有进程：pm2 delete all
    - 显示进程状态：pm2 list
    - 查看进程日志：pm2 logs
    - 查看指定进程：pm2 logs [name] / [ID]
    - 查看进程信息：pm2 show [name] / [ID]

