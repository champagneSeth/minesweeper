
const game = (function () {
    const font = '40px "Lucida Console", Monaco, monospace'
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
        ctx.font = font

        start(ctx)
    }

    const start = ctx => {
        // clear matrix
        while (matrix.length != 0) matrix.pop()

        // create new matrix
        for (let row = 0, y = yorigin; row < rows; row++, y += yres) {
            const m = []
            for (let col = 0, x = xorigin; col < cols; col++, x += xres) {
                const box = createBox(ctx, x, y, xres, yres)
                box.row = row; box.col = col
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


        // count mines
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let count = 0
                const box = matrix[row][col]

                if (checkForMine(row - 1, col - 1)) count++
                if (checkForMine(row - 1, col + 0)) count++
                if (checkForMine(row - 1, col + 1)) count++

                if (checkForMine(row + 0, col - 1)) count++
                if (checkForMine(row + 0, col + 1)) count++

                if (checkForMine(row + 1, col - 1)) count++
                if (checkForMine(row + 1, col + 0)) count++
                if (checkForMine(row + 1, col + 1)) count++

                box.count = count
            }
        }
    }

    const exists = (row, col) => {
        return !(row < 0 || row == rows || col < 0 || col == cols)
    }

    const checkForMine = (row, col) => {
        return exists(row, col) && matrix[row][col].isMine
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
        if (hoverBox && !hoverBox.selected) hoverBox.hover()
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

    const queue = []
    const revealIfExists = (row, col) => {
        if (exists(row, col)) {
            const box = matrix[row][col]
            if (!box.selected && !queue.includes(box)) queue.push(box)
        }
    }

    const reveal = (box) => {
        box.selected = true
        box.draw()
        const row = box.row
        const col = box.col
        if (box.count === 0) {
            revealIfExists(row - 1, col - 1)
            revealIfExists(row - 1, col + 0)
            revealIfExists(row - 1, col + 1)

            revealIfExists(row + 0, col - 1)
            revealIfExists(row + 0, col + 1)

            revealIfExists(row + 1, col - 1)
            revealIfExists(row + 1, col + 0)
            revealIfExists(row + 1, col + 1)
        }
        while (queue.length > 0) {
            reveal(queue.pop())
        }
    }

    const leftClick = (x, y) => {
        const box = boxLookup(x, y)
        if (box) {
            box.selected = true
            box.draw()
            if (box.isMine) alert('dang')
            reveal(box)
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
        init, start, quit,
        hover, clear,
        leftClick, rightClick,
    }
}());