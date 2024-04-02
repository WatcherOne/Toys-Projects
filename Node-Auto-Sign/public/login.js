;(function () {
    window.onload = () => {

        const $username = document.getElementById('username')
        const $password = document.getElementById('password')
        const $loginBtn = document.getElementById('login')
        const $email = document.getElementById('email')

        $loginBtn.addEventListener('click', submit)

        function submit (e) {
            e.preventDefault()
            const username = $username.value.trim()
            const password = $password.value.trim()
            const email = $email.value.trim()
            if (!username) {
                alert('账号名不可为空')
                return
            }
            if (!/^[A-Za-z0-9]+$/.test(username)) {
                alert('账号名只能包含英文与数字')
                return
            }
            if (!password) {
                alert('密码不可为空')
                return
            }
            setLoading()
            const data = JSON.stringify({ username, password, email })
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: data
            }).then(res => res.json()).then(res => {
                const { code, msg } = res
                if (code === 200) {
                    localStorage.setItem('watcher-auto-sign', username)
                    location.replace('/')
                } else {
                    alert(msg)
                }
            }).catch(err => {
                alert(err)
            }).finally(() => {
                removeLoading()
            })
        }

        const $loadingText = document.getElementById('loading-text')
        const $loading = document.getElementById('loading')
        function setLoading () {
            $loginBtn.setAttribute('disabled', 'disabled')
            $loadingText.classList.add('hide')
            $loading.classList.remove('hide')
        }

        function removeLoading () {
            $loginBtn.removeAttribute('disabled')
            $loadingText.classList.remove('hide')
            $loading.classList.add('hide')
        }
    }
})()
