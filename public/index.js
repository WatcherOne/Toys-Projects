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

    function handleProcess (data) {
        console.log('process: ', data)
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
        console.log('logs: ', data)
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
