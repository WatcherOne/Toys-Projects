let groupTimeRandom = JSON.parse(JSON.stringify(kanaList)).sort((a, b) => {
    return Math.random() > 0.5 ? -1 : 1
})

const $audio = document.getElementById('audio')
let pauseTimer = null
let timer = null
const total = groupTimeRandom.length
let i = -1
let isPlay = false
document.getElementById('js-total').innerHTML = `/${total}`

const $playBtn = document.getElementsByClassName('js-play')[0]
function control() {
    if (isPlay) {
        $playBtn.innerHTML = '播放'
        pause()
    } else {
        $playBtn.innerHTML = '暂停'
        play()
    }
}

function play() {
    timer && clearTimeout(timer)
    if (i >= total - 1) {
        isPlay = false
        return
    }
    isPlay = true
    i++
    onPlay()
    timer = setTimeout(() => {
        play()
    }, 3000)
}

function pause() {
    pauseTimer && clearTimeout(pauseTimer)
    timer && clearTimeout(timer)
    $audio.pause()
    isPlay = false
}

/**
 *  上一个单词
 *  1. 先清除 timer 防止主播放还在播放
 *  2. 隐藏文本动作的 class
 *  3. 然后位置往上移动 (到第一个时则从最后开始)
 **/
function playBefore() {
    timer && clearTimeout(timer)
    i = (i === 0 || i === -1) ? total - 1 : i - 1
    onPlay()
}

/**
 *  下一个单词
 *  1. 同理 先清除 timer
 *  2. 隐藏文本动作的 class
 *  3. 然后位置往前进（到最后一个则从第一个开始）
 **/
function playAfter() {
    timer && clearTimeout(timer)
    i = (i === -1 || i === total - 1) ? 0 : i + 1
    onPlay()
}

/**
 *  播放动作
 *  1. 播放前先清除文本与动画
 *  2. 设置当前播放位置
 *  3. 开始播放, 记录下一个新位置
 *  4. 播放1s后 音频暂定并开始展示文本
 **/
function onPlay() {
    hideText()
    hideAction()
    pauseTimer && clearTimeout(pauseTimer)
    const item = groupTimeRandom[i]
    // 当前播放时间位置，单位s
    $audio.currentTime = item.time
    $audio.play()
    showProgress()
    pauseTimer = setTimeout(() => {
        $audio.pause()
    }, 1000)
    setTimeout(() => {
        showText(item)
    }, 1000)
}

function showProgress() {
    const $progress = document.getElementById('js-percent')
    const $done = document.getElementsByClassName('js-done')[0]
    $done.innerHTML = Math.min(i + 1, total)
    const progress = Math.min((i + 1) / total * 100, 100)
    $progress.style.width = `${progress}%`
}

const $romanic = document.getElementsByClassName('js-romanic')[0]
const $hiragana = document.getElementsByClassName('js-hiragana')[0]
const $katakana = document.getElementsByClassName('js-katakana')[0]

function showText(item = {}) {
    const { romanic, hiragana, katakana } = item
    $romanic.classList.add('active-pin')
    $hiragana.classList.add('active-note')
    $katakana.classList.add('active-note')
    $romanic.innerHTML = romanic
    $hiragana.innerHTML = hiragana
    $katakana.innerHTML = katakana
}

function hideText() {
    $romanic.innerHTML = ''
    $hiragana.innerHTML = ''
    $katakana.innerHTML = ''
}

function hideAction() {
    $romanic.classList.remove('active-pin')
    $hiragana.classList.remove('active-note')
    $katakana.classList.remove('active-note')
}

function clear() {
    pauseTimer && clearTimeout(pauseTimer)
    timer && clearTimeout(timer)
    i = -1
    $audio.pause()
    $audio.currentTime = 0
    hideText()
    showProgress()
}

//  按顺序播放
function handleFullPlay() {
    clear()
    $audio.play()
}

function handleResetSort() {
    clear()
    groupTimeRandom = JSON.parse(JSON.stringify(kanaList)).sort((a, b) => {
        return Math.random() > 0.5 ? -1 : 1
    })
}