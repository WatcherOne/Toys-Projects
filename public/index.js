;(function () {

    const cookie = window.cookie
    console.log(cookie)

    const CODE = {
        SUCCESS: 200,
        NOTFOUND: 400,
        NOTLOGIN: 403
    }

    // 静态变量
    const HEADERS = {
        'Content-Type': 'application/json'
    }

    function init () {
        getInfo()
        getLogs()
    }

    function getInfo () {
        fetch('/api/getInfo', {
            method: 'GET',
            headers: HEADERS,
            credentials: 'include'
        }).then(res => res.json()).then(res => {
            const { code, data } = res
            if (code === CODE.SUCCESS) {
                // 是否签到 & 剩余矿石数
                const { isSigned, remianedPoint } = data || {}
                const msg = isSigned === true ? '今日已签到' : (isSigned === false ? '今日未签到' : '登陆已过期')
                document.getElementById('is-signed').innerHTML = msg
                document.getElementById('remained-point').innerHTML = remianedPoint || 0
            } else if (code === CODE.NOTLOGIN) {
                toLogin()
            }
        })
    }

    function toLogin () {
        document.cookie = ''
        window.location.replace('/login.html')
    }

    document.getElementById('start').addEventListener('click', startScript)
    function startScript () {
        fetch('/api/startScript', {
            method: 'GET',
            headers: HEADERS,
            credentials: 'include'
        }).then(res =>  res.json()).then(res => {
            const { code, data } = res
            if (code === 200) {
                alert('启动成功')
                // getProcess()
            } else {
                alert(data)
            }
        })
    }

    document.getElementById('stop').addEventListener('click', stopScript)
    function stopScript () {
        fetch('/api/stop', {
            method: 'GET',
            headers: HEADERS
        }).then(res =>  res.json()).then(res => {
            const { code, data } = res
            if (code === 200) {
                alert('停止成功')
                getProcess()
            } else {
                alert(data)
            }
        })
    }
    
    function getProcess () {
        fetch('/api/getProcess', {
            method: 'GET',
            headers: HEADERS
        }).then(res =>  res.json()).then(data => {
            handleProcess(data.data || '')
        })
    }

    const $processDom = document.getElementById('process-content')
    function handleProcess (data) {
        const strArr = data.split('│')
        strArr.pop()
        const times = Math.ceil(strArr.length / 14)
        let result = []
        for (let i = 0; i < times; i++) {
            let rowItem = []
            for (let j = 1; j < 14; j++) {
                const index = i * 14 + j
                rowItem.push(strArr[index] ? strArr[index].trim() : '')
            }
            result.push(rowItem)
        }
        let tr = ''
        result.forEach((arr, index) => {
            tr += '<tr>'
            arr.forEach(item => {
                tr += `${index ? '<td>' : '<th>'}${item}${index ? '</td>' : '</th>'}`
            })
            tr +=  '</tr>'
        })
        $processDom.innerHTML = tr
    }

    document.getElementById('update-log').addEventListener('click', getActivity)
    function getLogs () {
        fetch('/api/getLogs', {
            method: 'GET',
            headers: HEADERS,
            credentials: 'include'
        }).then(res => res.json()).then(data => {
            handleLogs(data)
        })
    }

    function handleLogs (data) {
        try {
            const result = (data.data || '').split('@')
            let logList = []
            result.forEach(item => {
                // 去掉 \n
                const str = item.replace('\n', '')
                const obj = str ? JSON.parse(str) : {}
                str && logList.push(obj)
            })
            appendLogToHtml(logList.reverse())
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const $logListDom = document.getElementById('log-list')
    function appendLogToHtml (list) {
        $logListDom.innerHTML = ''
        list.forEach(item => {
            const { currentTime, remainedPoint, signResult, freeDrawTimes, drawResult, signStatus, emailStatus, error } = item
            const $div = document.createElement('div')
            $div.classList.add('one-log')
            $div.innerHTML = error
            ? `
                <div class="top error">Error:</div>
                <div>${currentTime}---</div>
                <div class="error">${error}</div>
            `
            : `
                <div class="top">Success:</div>
                <div>${currentTime}---</div>
                <div>${signResult ? (getSignResult(signResult)) : (signStatus ? '今日已签到' : '今日未签到')}---</div>
                <div>剩余矿石数: <span class="count">${remainedPoint}</span>---</div>
                <div>${freeDrawTimes ? (drawResult || '') : '没有免费抽奖次数'}---</div>
                <div>${emailStatus ? '邮件发送成功' : '邮件发送失败'}</div>
            `
            $logListDom.appendChild($div)
        })
    }

    function getSignResult (signResult) {
        if (signResult === 'true') {
            return '签到成功'
        } else if (signResult === 'false') {
            return '签到失败'
        } else {
            return signResult
        }
    }

    function getActivity () {
        fetch('/api/getActivity', {
            method: 'POST',
            headers: HEADERS
        }).then(res => res.json()).then(res => {
            console.log(res)
        })
    }

    init()
    // getProcess()
})()

// fetch('/api/setCookie', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json;charset=utf-8',
//         'Accept': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//         cookie: 'dadadjajwhqgejwqejq'
//     })
// }).then(res => {
//     console.log(res)
// })
