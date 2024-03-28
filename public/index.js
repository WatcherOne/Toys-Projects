;(function () {

    // 静态变量
    const HEADERS = {
        'Content-Type': 'application/json',
    }

    const isSigned = false  // 是否签到
    const remianedPoint = 0 // 剩余矿石数

    function init () {
        fetch('/api/getCommon', {
            method: 'GET',
            headers: HEADERS,
        }).then(res => res.json()).then(res => {
            console.log(res)
        })
    }
    
    function getProcess () {
        fetch('/api/getProcess', {
            method: 'GET',
            headers: HEADERS
        }).then(res =>  res.json()).then(data => {
            handleProcess(data)
        })
    }

    const $processDom = document.getElementById('process-content')
    function handleProcess (data) {
        $processDom.innerHTML = data.data
    }

    function getLogs () {
        fetch('/api/getLogs', {
            method: 'GET',
            headers: HEADERS
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
            appendLogToHtml(logList)
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const $logListDom = document.getElementById('log-list')
    function appendLogToHtml (list) {
        list.forEach(item => {
            const { currentTime, remainedPoint } = item
            const $div = document.createElement('div')
            $div.innerHTML = `
                <div>${currentTime}</div>
                <div>${remainedPoint}</div>
            `
            $logListDom.appendChild($div)
        })
    }

    init()
    getProcess()
    getLogs()
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
