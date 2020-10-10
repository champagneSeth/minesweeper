
const eventCoord = event => {
    const rect = event.target.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return { x: x, y: y }
}

window.onload = () => {
    console.log('[ ui ] we made it')

    const canvas = document.getElementById("canvas")
    const startBtn = document.getElementById('start-btn')
    const quitBtn = document.getElementById('quit-btn')

    const ctx = canvas.getContext('2d')
    game.init(ctx)

    startBtn.addEventListener('click', event => {
        console.log('[ ui ] start button clicked')
        game.start(ctx)
    })

    quitBtn.addEventListener('click', event => {
        console.log('[ ui ] quit button clicked')
        game.quit()
    })

    canvas.addEventListener('mousemove', event => {
        const coord = eventCoord(event)
        game.hover(coord.x, coord.y)
    })

    canvas.addEventListener('mouseexit', event => {
        game.clear()
    })

    canvas.addEventListener('mousedown', event => {
        event.preventDefault()
        const coord = eventCoord(event)
        switch (event.button) {
            case 0: // left click
                game.leftClick(coord.x, coord.y)
                break;
            case 2: // right click
                game.rightClick(coord.x, coord.y)
                break;
            default:
        }
    })
}