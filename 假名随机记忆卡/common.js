const $mask = document.getElementById('mask-overlay')

function closeMask () {
    if (event) {
        event.stopPropagation()
        event.preventDefault()
    }
    $mask && $mask.classList.add('hide')
    window.afterCloseMask && window.afterCloseMask()
}

function openMask () {
    event.stopPropagation()
    event.preventDefault()
    $mask && $mask.classList.remove('hide')
}
