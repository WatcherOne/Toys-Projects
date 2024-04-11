;(function () {

    const KEY = 'watcher-auto-sign'
    const username = localStorage.getItem(KEY)
    if (!username) {
        toLogin()
        return
    }

    // 设置用户名
    document.getElementById('username').innerHTML = username

    // 设置用户水印
    const $watermark = document.getElementById('watermark')
    const waterImg = setWaterMark({ waterMarkText: username })
    $watermark.style.backgroundImage = `url(${waterImg})`

    const CODE = {
        SUCCESS: 200,
        NOTTOKEN: 403,
        NOTFOUND: 404,
        NOTLOGIN: 405,
        ERROR: 500
    }

    // 静态变量
    const HEADERS = {
        'Content-Type': 'application/json'
    }

    let juejinToken = ''

    function getInfo () {
        fetch('/api/getInfo', {
            method: 'GET',
            headers: HEADERS,
            credentials: 'include'
        }).then(res => res.json()).then(res => {
            const { code, data, msg } = res
            const { token, email, hour, minute, second } = data || {}
            if (token) juejinToken = token
            if (code === CODE.SUCCESS) {
                // 是否签到 & 剩余矿石数
                const { isSigned, remianedPoint } = data || {}
                const msg = isSigned === true ? '已签到' : (isSigned === false ? '未签到' : 'Token已过期')
                document.getElementById('is-signed').innerHTML = msg
                document.getElementById('remained-point').innerHTML = remianedPoint || 0
                $email && ($email.value = email)
                $hour && ($hour.value = hour)
                $minute && ($minute.value = minute)
                $second && ($second.value = second)
                getProcess()
                getLogs()
                getActivity()
            } else if (code === CODE.NOTLOGIN) {
                alert(msg)
                toLogin()
            } else if (code === CODE.NOTTOKEN) {
                document.getElementById('is-signed').innerHTML = juejinToken ? 'Token Error' : 'Token Empty'
                alert(msg)
            }
        })
    }

    function toLogin () {
        location.replace('/login.html')
    }

    const $tokenDom = document.getElementById('token')
    const $email = document.getElementById('dialog-email')
    const $hour = document.getElementById('dialog-hour')
    const $minute = document.getElementById('dialog-minute')
    const $second = document.getElementById('dialog-second')
    document.getElementById('settings').addEventListener('click', () => {
        $tokenDom && ($tokenDom.value = juejinToken)
        showElement('mask')
    })
    document.getElementById('cancel').addEventListener('click', () => hideElement('mask'))

    document.getElementById('tokenSubmit').addEventListener('click', setToken)
    function setToken () {
        const email = $email.value.trim()
        const token = $tokenDom.value.trim()
        if (!token) {
            alert('请输入Token')
            return
        }
        let hour = $hour.value
        let minute = $minute.value
        let second = $second.value
        hour = setRange(hour)
        minute = setRange(minute)
        second = setRange(second)
        fetch('/api/setToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ token, email, hour, minute, second })
        }).then(res => res.json()).then(res => {
            const { code, msg } = res
            if (code === CODE.SUCCESS) {
                getInfo()
                hideElement('mask')
                alert('设置成功, 请重启脚本来执行新的配置')
            } else if (code === CODE.NOTLOGIN) {
                alert(msg)
                toLogin()
            }
        }).catch(err => {
            alert(err)
        })
    }
    function setRange (value) {
        value = Math.max(0, value)
        value = Math.min(24, value)
        return value
    }

    document.getElementById('start').addEventListener('click', startScript)
    function startScript () {
        if (!juejinToken) {
            alert('请先设置Token')
            return
        }
        fetch('/api/startScript', {
            method: 'GET',
            headers: HEADERS,
            credentials: 'include'
        }).then(res =>  res.json()).then(res => {
            const { code, msg } = res
            code === CODE.SUCCESS && getProcess()
            alert(msg)
        })
    }

    document.getElementById('stop').addEventListener('click', stopScript)
    function stopScript () {
        if (!juejinToken) {
            alert('请先设置Token')
            return
        }
        fetch('/api/stopScript', {
            method: 'GET',
            headers: HEADERS,
            credentials: 'include'
        }).then(res =>  res.json()).then(res => {
            const { code, msg } = res
            code === CODE.SUCCESS && getProcess()
            alert(msg)
        })
    }
    
    function getProcess () {
        fetch('/api/getProcess', {
            method: 'GET',
            headers: HEADERS
        }).then(res =>  res.json()).then(res => {
            const { code, msg, data } = res
            if (code === CODE.SUCCESS) {
                handleProcess(data || '')
            } else {
                handleErrorProcess(msg)
            }
        })
    }

    const $processDom = document.getElementById('process-table')
    function handleProcess (data) {
        showElement('process-table')
        const strArr = data.split('│')
        strArr.pop()
        const rowTime = Math.ceil(strArr.length / 14)
        rowTime > 1 ? hideElement('process-no-data') : showElement('process-no-data')
        let result = []
        for (let i = 0; i < rowTime; i++) {
            let rowItem = []
            for (let j = 1; j < 14; j++) {
                const index = i * 14 + j
                rowItem.push(strArr[index] ? strArr[index].trim() : '')
            }
            result.push(rowItem)
        }
        let tr = ''
        result.forEach((arr, index) => {
            tr += `<tr class="${index === 0 ? '' : 'body-tr'}">`
            arr.forEach(item => {
                tr += `${index ? '<td>' : '<th>'}${item}${index ? '</td>' : '</th>'}`
            })
            tr +=  '</tr>'
        })
        $processDom.innerHTML = tr
    }
    function handleErrorProcess (msg) {
        hideElement('process-table')
        showElement('process-no-data')
        const $process = document.getElementById('process-no-data')
        $process.innerHTML = msg
    }

    document.getElementById('update-log').addEventListener('click', getLogs)
    function getLogs () {
        if (!juejinToken) {
            alert('请先设置Token')
            return
        }
        fetch('/api/getLogs', {
            method: 'GET',
            headers: HEADERS,
            credentials: 'include'
        }).then(res => res.json()).then(res => {
            const { code, msg, data } = res
            if (code === CODE.SUCCESS) {
                data ? handleLogs(data) : ($logListDom.innerHTML = '暂无日志数据')
            } else {
                alert(JSON.stringify(msg))
            }
        })
    }

    function handleLogs (data) {
        try {
            const result = (data || '').split('@')
            let logList = []
            result.forEach(item => {
                // 去掉 \n
                const str = item.replace('\n', '')
                const obj = str ? JSON.parse(str) : {}
                str && logList.push(obj)
            })
            appendLogToHtml(logList.reverse())
        } catch (error) {
            alert(error)
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
                <div class="first error">Error:</div>
                <div>${currentTime} ---&nbsp</div>
                <div class="error">${error}</div>
            `
            : `
                <div class="first">Success:</div>
                <div>${currentTime} ---&nbsp;</div>
                <div>${signResult ? (getSignResult(signResult)) : (signStatus ? '今日已签到' : '今日未签到')} ---&nbsp</div>
                <div>剩余矿石数: <span class="count">${remainedPoint}</span> ---&nbsp</div>
                <div>${freeDrawTimes ? (drawResult || '') : '没有免费抽奖次数'} ---&nbsp</div>
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

    const $activityList = document.getElementById('activity-content')
    document.getElementById('update-activity').addEventListener('click', getActivity)
    function getActivity () {
        fetch('/api/getActivity', {
            method: 'POST',
            headers: HEADERS,
            credentials: 'include'
        }).then(res => res.json()).then(res => {
            const { code, msg, data } = res
            if (code === CODE.SUCCESS) {
                if (data) {
                    handleActivity(data)
                } else {
                    $activityList.innerHTML = '暂无活动数据'
                }
            } else {
                alert(JSON.stringify(msg))
            }
        })
    }
    function handleActivity (data) {
        const { running_competitions, history_competitions } = data || {}
        const runningList = handleActivityList(running_competitions, true)
        const historyList = handleActivityList(history_competitions)
        $activityList.innerHTML = (runningList || historyList) ? (runningList + historyList) : '暂无活动数据'
    }
    function handleActivityList (list, real = false) {
        let result = ''
        if (list.length === 0) return ''
        list.map(item => {
            const { banner_info, title, description, sponsor_link, path_name, register_begin_time, result_publish_time } = item
            const bannerInfo = banner_info ? JSON.parse(banner_info) : {}
            const bannerCover = bannerInfo.banners?.detail_page_web?.banner_cover
            const bannerImg = bannerCover?.image?.url
            const startTime = getDate(register_begin_time)
            const endTime = getDate(result_publish_time)
            result += `<div class="activity-item">
                <div class="banner">
                    <img src="${bannerImg}" alt="banner-img" />
                </div>
                <div class="detail">
                    <div class="title">
                        <a href="${sponsor_link + path_name}" target="_blank">${title}</a>
                        ${
                            real
                            ? `<span class="real">正在进行中</span>`
                            : `<span class="limit">${startTime} ~ ${endTime}</span>`
                        }
                    </div>
                    <div class="desc">${description}</div>
                </div>
            </div>`
        })
        return result
    }
    function getDate (time) {
        return new Date(time * 1000).toLocaleDateString()
    }

    function setWaterMark (option = {}) {
        let arr = []
        const {
            waterMarkText = '',
            rotate = 45,
            color = 'rgb(201 201 201)',
            fontSize = 16
        } = option
      
        if (Object.prototype.toString.call(waterMarkText) === '[object Array]') {
            arr = waterMarkText
        } else if (Object.prototype.toString.call(waterMarkText) === '[object String]') {
            arr = [waterMarkText]
        }
      
        const canvas = document.createElement('canvas')
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        const horizontalWidth = ctx.measureText(waterMarkText).width      
        canvas.width = 150
        canvas.height = 150
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = color
        ctx.font = `${fontSize}px Microsoft Yahei`
        const draw = (text, x, y) => {
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate((-rotate / 180) * Math.PI)
            ctx.fillText(text, 0, 0)
            ctx.restore()
        }
      
        arr.forEach((item, index) => {
            ctx.beginPath()
            draw(item, 60 + horizontalWidth / 2, 50 * (index + 1) + horizontalWidth / 2)
            ctx.closePath()
        })

        return canvas.toDataURL('image/png')
    }

    getInfo()

    function showElement (elementId) {
        const $el = document.getElementById(elementId)
        if (!$el) return
        $el.classList.remove('hide')
    }

    function hideElement (elementId) {
        const $el = document.getElementById(elementId)
        if (!$el) return
        $el.classList.add('hide')
    }

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem(KEY)
        toLogin()
    })
})()
