
window.onload = () => {
    const canvas = document.getElementById('canvas')
    const numMines = document.getElementById('num-mines')
    const startBtn = document.getElementById('start-btn')
    const quitBtn = document.getElementById('quit-btn')

    const ctx = canvas.getContext('2d')
    minesweeper.init(ctx)

    const eventCoord = event => {
        const rect = event.target.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        return { x: x, y: y }
    }

    const updateCount = count => {
        numMines.innerHTML = count
    }

    startBtn.addEventListener('click', event => {
        minesweeper.start(ctx)
    })

    quitBtn.addEventListener('click', event => {
        minesweeper.quit()
    })

    canvas.addEventListener('mousemove', event => {
        const coord = eventCoord(event)
        minesweeper.hover(coord.x, coord.y)
    })

    canvas.addEventListener('mouseexit', event => {
        minesweeper.clear()
    })

    canvas.addEventListener('mousedown', event => {
        event.preventDefault()
        const coord = eventCoord(event)
        switch (event.button) {
            case 0: // left click
                minesweeper.leftClick(coord.x, coord.y)
                break;
            case 2: // right click
                minesweeper.rightClick(coord.x, coord.y, updateCount)
                break;
            default:
        }
    })
}