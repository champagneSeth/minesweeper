
const emojis = {
    smile: '🙂',
    kiss: '😗',
    wow: '😮',
    think: '🤔',
    laugh: '🤣',
    cool: '😎',
    huh: '🤨',
}

window.onload = () => {

    const canvas = document.getElementById('canvas')
    const emoji = document.getElementById('emoji')
    const numMines = document.getElementById('num-mines')
    const startBtn = document.getElementById('start-btn')
    const quitBtn = document.getElementById('quit-btn')

    const eventPoint = event => {
        const rect = event.target.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        return { x: x, y: y }
    }

    state.win = msg => {
        emoji.innerHTML = emojis['cool']
        console.log(msg)
    }

    state.lose = msg => {
        emoji.innerHTML = emojis['laugh']
        console.log(msg)
    }

    state.update = count => {
        numMines.innerHTML = count
    }

    startBtn.addEventListener('click', event => {
        emoji.innerHTML = emojis['smile']
        minesweeper.start()
    })

    quitBtn.addEventListener('click', event => {
        emoji.innerHTML = emojis['huh']
        minesweeper.quit()
    })

    canvas.addEventListener('mousemove', event => {
        if (state.playing) minesweeper.hover(eventPoint(event))
    })

    canvas.addEventListener('mouseexit', event => {
        if (state.playing) minesweeper.hover({ x: -1, y: -1 })
    })

    canvas.addEventListener('mousedown', event => {
        event.preventDefault()
        if (state.playing) {
            emoji.innerHTML = emojis['think']
            switch (event.button) {
                case 0: // left click
                    minesweeper.leftClick(eventPoint(event)); break
                case 2: // right click
                    minesweeper.rightClick(eventPoint(event)); break
                default:
            }
        }
    })

    let count = 0 // use counter to rotate emojis
    canvas.addEventListener('mouseup', event => {
        if (state.playing) {
            let chosen
            switch (count++ % 3) {
                case 0: chosen = 'smile'; break
                case 1: chosen = 'wow'; break
                case 2: chosen = 'kiss'; break
            }
            emoji.innerHTML = emojis[chosen]
        }
    })

    matrix.init(canvas.getContext('2d'))
    minesweeper.start()
}