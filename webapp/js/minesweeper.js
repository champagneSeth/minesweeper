

const game = (function () {
    const lineColor = "darkgrey"
    const hoverColor = "cornflowerblue"

    const lineWdith = 2
    const padding = 10
    const fullPadding = padding * 2

    const xorigin = padding
    const yorigin = padding

    const rows = 16
    const cols = 16
    const numMines = 20
    const matrix = []

    let width, height, yres, xres

    const init = ctx => {
        ctx = ctx

        width = ctx.canvas.width - fullPadding
        height = ctx.canvas.height - fullPadding
        yres = height / rows
        xres = width / cols

        // init style
        ctx.lineWidth = lineWdith
        ctx.strokeStyle = lineColor

        start(ctx)
    }

    const start = ctx => {
        // create matrix
        matrix.length = 0
        for (let row = 0, y = yorigin; row < rows; row++, y += yres) {
            const m = []
            for (let col = 0, x = xorigin; col < cols; col++, x += xres) {
                let box = createBox(ctx, x, y, xres, yres)
                box.draw()
                m.push(box)
            }
            matrix.push(m)
        }

        // assign mines
        for (let i = 0, searching = true; i < numMines; i++, searching = true) {
            while (searching) {
                const row = Math.floor(Math.random() * rows)
                const col = Math.floor(Math.random() * cols)
                const box = matrix[row][col]
                if (!box.isMine) {
                    box.isMine = true
                    searching = false
                }
            }
        }
    }


    const boxLookup = (x, y) => {
        const row = Math.floor((y - yorigin) / yres)
        const col = Math.floor((x - xorigin) / xres)

        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            return matrix[row][col]
        } else {
            return;
        }
    }


    let hoverBox
    const hover = (x, y) => {
        const box = boxLookup(x, y)
        if (hoverBox) hoverBox.draw()
        hoverBox = box
        if (hoverBox && !hoverBox.selected) hoverBox.fillBox(hoverColor)
    }

    const clear = () => {
        if (hoverBox) hoverBox.draw()
    }

    const quit = () => {
        matrix.forEach(row => {
            row.forEach(box => {
                box.selected = true
                box.draw()
            })
        })
    }

    const leftClick = (x, y) => {
        const box = boxLookup(x, y)
        if (box) {
            box.selected = true
            box.draw()
        }
    }

    const rightClick = (x, y) => {
        const box = boxLookup(x, y)
        if (box) {
            box.marked = true
            box.draw()
        }
    }

    return {
        init: init,
        start: start,
        quit, quit,
        hover: hover,
        clear: clear,
        leftClick: leftClick,
        rightClick: rightClick,
    }

}());