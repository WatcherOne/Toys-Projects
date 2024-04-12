const $box = document.getElementById('box')
const $tips = document.getElementById('tips')
const $typeList = document.getElementById('type-list')
let timer = null

/********************************* 初始化定义变量 ******************************************/
/**
 * selectRow:       选择的哪些行假名
 * selectKanaType:  选择的哪种假名（平假名/片假名）
 * showWordList:    保存已显示的假名list（为了切换片假名）
 */
let selectRow = []
let selectKanaType = 'hiragana'
let showWordList = []

/********************************* 入口路径 ******************************************/
/**
 * 默认显示 a 行假名
 */
window.onload = () => {
    selectRow.push('a')
    createWords()
    onPolling()
}

window.onunload = () => {
    morningCount = 0
    eveningCount = 0
    timer && clearInterval(timer)
}

/********************************* 生成单词表 ******************************************/
function createWords () {
    if (!selectRow.length) {
        alert('请选择某一行假名')
        return
    }
    const wordList = kanaList.filter(item => selectRow.includes(item.row))
    const total = selectRow.length * 10
    const result = []
    showWordList = []
    for (let i = 0; i < total; i++) {
        const index = Math.ceil(Math.random() * wordList.length) - 1
        const item = wordList[index]
        showWordList.push(item)
        result.push(item[selectKanaType])
    }
    renderWords(result)
}

/********************************* 渲染单词 ******************************************/
function renderWords (list) {
    let result = ''
    if (selectRow.length > 5) {
        $box.classList.remove('center')
    } else {
        $box.classList.add('center')
    }
    list.forEach((word, index) => {
        const isEnd = index % 5 === 0
        const rowSerial = Math.floor(index / 5) + 1
        const dom = index === 0
            ? `<div class="word-row"><span class="serial">${index + 1}</span>`
            : (isEnd ? `</div><div class="word-row"><span class="serial">${rowSerial}</span>` : '')
        result += `${dom}<span class="word-item">${word}</span>`
    })
    $box.innerHTML = `${result}</div>`
}

/********************************* 切换行 ******************************************/
function handleSelectRow () {
    event.stopPropagation()
    event.preventDefault()
    const $target = event.target
    const { value } = $target.dataset || {}
    if (!value) return
    $target.classList.toggle('select')
}
function confirmSelectRow () {
    event.stopPropagation()
    event.preventDefault()
    const $rowList = $typeList.querySelectorAll('.select')
    if (!$rowList.length) {
        alert('请至少选择一行')
        return
    }
    selectRow = []
    $rowList.forEach($el => {
        const { value } = $el.dataset || {}
        selectRow.push(value)
    })
    createWords()
    closeMask()
}
// 关闭弹窗之后, 如果未确认则回退行的选择
function afterCloseMask () {
    const $rowList = $typeList.querySelectorAll('.item')
    $rowList.forEach($el => {
        const { value } = $el.dataset || {}
        selectRow.includes(value) ? $el.classList.add('select') : $el.classList.remove('select')
    })
}

/********************************* 切换假名类型 ******************************************/
function handleSelectKana () {
    const $target = event.target
    const { value } = $target.dataset || {}
    if (value === selectKanaType) return
    const $li = document.querySelectorAll('.kana-li')
    $li.forEach($el => $el.classList.remove('select'))
    $target.classList.add('select')
    selectKanaType = value
    if (!showWordList.length) return
    renderWords(showWordList.map(item => {
        return item[selectKanaType]
    }))
}

/********************************* 重置单词表 ******************************************/
function handleReset () {
    createWords()
}

/********************************* 清除单词表 ******************************************/
function handleClear () {
    selectRow = []
    const $rowList = document.getElementById('type-list').querySelectorAll('.item')
    $rowList.forEach($el => $el.classList.remove('select'))
    showWordList = []
    $box.innerHTML = ''
}

/********************************* 轮询监听事件 ******************************************/
let morningCount = 0
let eveningCount = 0
// 2s 轮询一次监听是否显示 tips
function onPolling () {
    timer = setInterval(() => {
        let result = ''
        if (new Date().getHours() >= 22 && eveningCount < 12) {
            const time = new Date()
            const timeStr = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
            eveningCount++
            result = `已经晚上: ${timeStr} 了! 请合理安排学习时间, 明早继续学习！`
        } else if ([6, 7, 8, 9].includes(new Date().getHours()) && eveningCount < 12) {
            morningCount++
            result = '早上好！一日之计在于晨, 自律就是成功了一半！'
        } else if (selectRow.includes('ra')) {
            result = '你已经离胜利不远了, 坚持就是胜利！✊！✌️！'
        } else if (selectRow.includes('wa')) {
            result = '恭喜你！你已经学完了五十个假名, 您可以尝试更多假名组合记忆！'
        }
        showTips(result)
    }, 5000)
}

function showTips (text) {
    $tips.innerHTML = text
}
