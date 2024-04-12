window.onload = () => {
    // 地图随机性 - 生成不同大小的地图？
    // 多人在线对战？(抢食物？不能碰撞到？)
    // 不同的食物作用不同？
    // 记录用户分数

    $start.addEventListener('click', startGame)
    $stop.addEventListener('click', stopGame)
    $restart.addEventListener('click', () => {
        init()
        startGame()
    })
    $again.addEventListener('click', () => {
        init()
        $layer.classList.add('hidden')
        startGame()
    })
    $cancel.addEventListener('click', () => {
        $layer.classList.add('hidden')
    })

    const bgColor = 'white'
    const snakeHeadColor = '#cc4b4b'
    const snakeBodyColor = '#1a8dcc'
    const foodColor = 'yellow'

    let snakeArr = []      // 20 * 20 矩形，则 400块格子，队列表示 蛇整身数组范围【0 ~ 399】
    let food = 0           // 食物的位置，范围【0 ~ 399】
    let direction = 1      // 表示蛇运动方向，范围 { 1, -1, 20, -20 } 只要加上这个值就表示新蛇头的位置
    let speed = levelObj.simplyMode
    let score = 0
    let specialPosArr = []

    // 进入网页初始化
    function init () {
        ctx.clearRect(0, 0, 400, 400)
        snakeArr = [null, null, null]
        score = 0
        updateScore()
        // 初始化蛇的位置
        const snakeHeadPos = random(0, 400)
        snakeArr[0] = snakeHeadPos
        const { x, y } = getDrawPos(snakeHeadPos)
        const xDirection = x <= 200 ? 1 : -1
        const yDirection = y >= 200 ? -20 : 20
        direction = Math.random() * 10 > 5 ? xDirection : yDirection
        // 初始化随机食物位置 - (食物不能在蛇内部)
        while(snakeArr.indexOf((food = random(0, 400))) >= 0);
        draw(snakeHeadPos, snakeHeadColor)
        draw(food, foodColor)
        initSurprisePos()
    }

    function runGame () {
        // 每次移动前, 同步一下难度等级
        speed = getSyncLevel()
        // 新蛇头的位置
        const newPos = snakeArr[0] + direction
        // 添加新蛇头到队列前
        snakeArr.unshift(newPos)  
        // 判断蛇头是否超出边界
        if (checkIsOverBound(newPos)) return
        draw(newPos, snakeHeadColor)       // 绘制新蛇头
        draw(snakeArr[1], snakeBodyColor)  // 绘制之前的蛇头为蛇身
        if (handleSurpriseEvent(newPos)) return // 遇到遇到随机事件
        if (newPos === food) {   // 刚好吃到食物
            score += 1
            updateScore()
            // 重新刷新食物【不可占在蛇的位置和随机事件的位置】
            const specialArr = specialPosArr.map(item => item.pos)
            while([...snakeArr, ...specialArr].indexOf((food = random(0, 400))) >= 0);
            draw(food, foodColor)
        } else {
            // 未吃到食物则去除蛇尾最后一个格子, 因为移动了，然后绘制成白色
            draw(snakeArr.pop(), bgColor)
        }  
    }

    function gameOver () {
        cancelAnimationFrame(runId)
        // 显示结果
        $layerScore.innerText = score
        $layer.classList.remove('hidden')
    }

    function updateScore () {
        $score.innerText = `${score}`
    }

    function initSurprisePos () {
        // 随机获得偶遇位置【2个吧】
        let pos = []
        do {
            const nextPos = random(0, 400)
            // 随机事件不能与蛇与食物重合
            if ([...snakeArr, food].indexOf(nextPos) < 0) {
                pos.push(nextPos)
            }
        } while (pos.length < 2)
        const list = surprisePos.slice(0, 2)
        list.forEach((item, index) => {
            item.pos = pos[index] || 0
        })
        specialPosArr = list
        // Test: 随机事件位置
        // specialPosArr.forEach(item => {
        //     draw(item.pos, 'blue')
        // })
    }

    function handleSurpriseEvent (newPos) {
        const length = specialPosArr.length
        for (let i = 0; i < length; i++) {
            const { pos, text, increase, value } = specialPosArr[i]
            if (pos === newPos) {  // 当碰到随机事件时
                showSurprise(text) // 显示随机事件
                score += value     // 更新得分
                updateScore()
                // Todo increase: 体积问题怎么做？
                specialPosArr.slice(i, 1)
                // 移动了, 则去除蛇尾
                draw(snakeArr.pop(), bgColor)
                return true
            }
        }
        return false
    }

    function showSurprise (text) {
        $specialText.innerText = text
        $specialBox.classList.remove('hidden')
        setTimeout(() => {
            $specialBox.classList.add('hidden')
        }, 1500)
    }

    function checkIsOverBound (pos) {
        // 撞到蛇了
        const isSnakePos = snakeArr.indexOf(pos, 1) > 0
        if (isSnakePos || pos < 0 || pos > 399 || (direction === 1 && pos % 20 === 0) || (direction === -1 && pos % 20 === 19)) {
            gameOver()
            return true
        }
        return false
    }

    // 键盘绑定事件
    const keydownMap = {
        ArrowUp: -20,
        ArrowDown: 20,
        ArrowLeft: -1,
        ArrowRight: 1,
        w: -20,
        s: 20,
        a: -1,
        d: 1
    }
    document.onkeydown = (e) => {
        const key = e.key
        const newDirection = keydownMap[key] || direction
        // 若方向与原方向相同, 则方向不变
        direction = (snakeArr[1] - snakeArr[0] === newDirection) ? direction : newDirection
        if (key === 'c') {
            $start.click()
        } else if (key === 'p') {
            $stop.click()
        } else if (key === 'r') {
            $restart.click()
        }
    }

    let runId = null
    let enable = true
    function startGame () {
        if (enable) {
            enable = false
            requestAnimationFrame(runGame)
            // 通过 enable 来控制绘制蛇移动的时间间隔
            setTimeout(() => enable = true, speed)
        }
        runId = requestAnimationFrame(startGame)
    }

    function stopGame () {
        cancelAnimationFrame(runId)
    }

    init()
}

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const $start = document.getElementById('start')
const $stop = document.getElementById('stop')
const $restart = document.getElementById('restart')
const $again = document.getElementById('again')
const $cancel = document.getElementById('cancel')
const $specialBox = document.getElementById('special-box')
const $specialText = document.getElementById('special-text')
const $layer = document.getElementById('game-over-layer')
const $layerScore = document.getElementById('game-score')
const $radios = document.querySelectorAll('input[name="level"]')
const $score = document.getElementById('score')
// 刷新间隔表示蛇的速度，刷新间隔越长，则蛇的速度越慢
const levelObj = {
    simplyMode: 300,
    middleMode: 200,
    hardMode: 100
}

// 绘制格子
function draw (seat, color) {
    ctx.fillStyle = color
    // 绘制方块 x坐标、y坐标、长、宽
    const { x, y } = getDrawPos(seat)
    ctx.fillRect(x, y, 18, 18)
}

// 获得当前位置的坐标
function getDrawPos (seat) {
    return {
        x: (seat % 20) * 20 + 1,
        y: Math.floor(seat / 20) * 20 + 1
    }
}

// 产生可能出现的随机位置
function random (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

// 获得最新难度等级
function getSyncLevel () {
    let speedValue = ''
    for (let i = 0; i < $radios.length; i++) {
        if ($radios[i].checked) {
            speedValue = $radios[i].value
            break
        }
    }
    return levelObj[speedValue] || levelObj.simplyMode
}
