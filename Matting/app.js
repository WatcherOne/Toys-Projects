const $upload = document.getElementById('js-upload')
const $colorPicker = document.getElementById('js-remove-color')
const $range = document.getElementById('js-range')
const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')

// 点击上传图片
function upload() {
    $upload.click()
}

let resultUrl = null

// 上传图片回调
function afterUpload() {
    const files = event.target.files || []
    const img = files[0]
    if (img) {
        let reader = new FileReader()
        reader.readAsDataURL(img)
        reader.onload = function () {
            resultUrl = this.result
            const $img = document.createElement('img')
            $img.src = resultUrl
            $img.onload = () => {
                canvas.width = $img.width
                canvas.height = $img.height
                context.drawImage($img, 0, 0)
            }
        }
    }
}

// 纯色抠图
// 当去除颜色未填写则 - 以第一个元素（背景）为基准的去除
function pureMatting () {
    if (!resultUrl) {
        alert('请先上传图片')
        return
    }
    const imageInfo = context.getImageData(0, 0, canvas.width, canvas.height)
    // pixiArr 是一个数组，每四个数组元素代表一个像素点，分别对应一个像素的 r/g/b/a值
    let pixiArr = imageInfo.data
    const removeColorStr = $colorPicker.value || `${pixiArr[0]},${pixiArr[1]},${pixiArr[2]}`
    const removeColor = removeColorStr.split(',')
    const range = $range.value || 0
    for (let i = 0; i < pixiArr.length; i += 4) {
        // 匹配到目标像素就将目标像素的 alpha 设为0
        if (checkColor([pixiArr[i], pixiArr[i + 1], pixiArr[i + 2]], removeColor, range)) {
            pixiArr[i + 3] = 0
        }
    }
    context.putImageData(imageInfo, 0, 0)
}

// 边界扣图
function boundaryMatting () {
    if (!resultUrl) {
        alert('请先上传图片')
        return
    }
    const imageInfo = context.getImageData(0, 0, canvas.width, canvas.height)
    let pixiArr = imageInfo.data
    const removeColorStr = $colorPicker.value || `${pixiArr[0]},${pixiArr[1]},${pixiArr[2]}`
    const removeColor = removeColorStr.split(',')
    const range = $range.value || 0
    handleRow(pixiArr, removeColor, range)
    handleCol(pixiArr, removeColor, range)
    context.putImageData(imageInfo, 0, 0)
}

/**
 *  处理行 - 边界
 */
// 对每一行分别进行扫描，定义一个左左指针 left 指向这一行的第一个像素，定义一个右指针 right 指向这一行最后一个像素
// 并用一个 leftF 标识左边是否碰到边界，一个 rightF 标识右边是否碰到边界
// 当没碰到边界时指针就一直向内收缩，直到两个指针都碰到边界或者左右指针重合就跳到下一行,直到所有行都扫描完毕
function handleRow (pixiArr, removeColor, range) {
    for (let row = 0; row < canvas.height; row++) {
        let left = row * 4 * canvas.width            // 指向行首元素
        let right = left + 4 * canvas.width - 1 - 3  // 指向行尾元素
        let leftF = false
        let rightF = false
        // 当左右指针都为true, 即都碰到边界时结束
        while (!leftF || !rightF) {
            if (!leftF) {
                if (checkColor([pixiArr[left], pixiArr[left + 1], pixiArr[left + 2]], removeColor, range)) {
                    pixiArr[left + 3] = 0
                    left += 4 // 向右移动到下一个像素
                } else {
                    leftF = true // 碰到边界
                }
            }
            if (!rightF) {
                if (checkColor([pixiArr[right], pixiArr[right + 1], pixiArr[right + 2]], removeColor, range)) {
                    pixiArr[right + 3] = 0
                    right -= 4 // 向左移动到下一个像素
                } else {
                    rightF = true // 碰到边界
                }
            }
            if (left === right) {
                // 左右指针重合
                leftF = true
                rightF = true
            }
        }
    }
}

/**
 *  处理列 - 边界
 */
function handleCol (pixiArr, removeColor, range) {
    for (let col = 0; col < canvas.width; col++) {
        let top = col * 4        // 指向列头
        let bottom = top + (canvas.height - 2) * canvas.width * 4 + canvas.width * 4  // 指向列尾
        let topF = false
        let bottomF = false
        while (!topF || !bottomF) {
            if (!topF) {
                if (checkColor([pixiArr[top], pixiArr[top + 1], pixiArr[top + 2]], removeColor, range)) {
                    pixiArr[top + 3] = 0
                    top += canvas.width * 4
                } else {
                    topF = true
                }
            }
            if (!bottomF) {
                if (checkColor([pixiArr[bottom], pixiArr[bottom + 1], pixiArr[bottom + 2]], removeColor, range)) {
                    pixiArr[bottom + 3] = 0
                    bottom -= canvas.width * 4
                } else {
                    bottomF = true
                }
            }
            if (top == bottom) {
                topF = true
                bottomF = true
            }
        }
    }
}

// 检测当前颜色是不是需要移除的颜色
function checkColor (current, target, range = 0) {
    for (let i = 0; i < 3; i++) {
        // 判断当前颜色与去除颜色 target 的容差为 0.2 的比对
        // 不同的容差会得到不同的效果
        // 对于底色是标准纯色的图片就不需要容差了
        if (!((1 - range) * target[i] <= current[i] && (1 + range) * target[i] >= current[i])) return false
    }
    return true
}

function reset () {
    const $img = document.createElement('img')
    $img.src = resultUrl
    $img.onload = () => {
        canvas.width = $img.width
        canvas.height = $img.height
        context.drawImage($img, 0, 0)
    }
}

// 图片下载
function downloadImg () {
    if (!resultUrl) {
        alert('请先上传图片')
        return
    }
    const url = canvas.toDataURL('image/jpeg')
    const elink = document.createElement('a')
    elink.style.display = 'none'
    elink.href = url
    elink.download = `${+new Date()}`
    document.body.appendChild(elink)
    elink.click()
    document.body.removeChild(elink)
}
