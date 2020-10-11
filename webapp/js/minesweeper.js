
const minesweeper = (function () {
    const font = '30px "Lucida Console", Monaco, monospace'
    const lineWdith = 2
    const padding = 10
    const fullPadding = padding * 2

    const xorigin = padding
    const yorigin = padding

    const rows = 16
    const cols = 16
    const numMines = 40
    const allCleared = (rows * cols) - numMines
    const matrix = []

    let width, height, yres, xres
    let minesAssigned = false
    let foundMines = 0
    let cleared = 0

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

        minesAssigned = false
        foundMines = 0
        cleared = 0

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
    }

    const initMines = (clickedBox) => {
        minesAssigned = true

        // assign mines
        for (let i = 0, searching = true; i < numMines; i++, searching = true) {
            while (searching) {
                const row = Math.floor(Math.random() * rows)
                const col = Math.floor(Math.random() * cols)

                let notAllowed = row === clickedBox.row && col === clickedBox.col
                allAdjacentBoxes(clickedBox.row, clickedBox.col, adjacent => {
                    if (row === adjacent.row && col === adjacent.col) {
                        notAllowed = true
                    }
                })
                if (notAllowed) continue

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
                allAdjacentBoxes(row, col, box => {
                    if (box.isMine) count++
                })
                matrix[row][col].count = count
            }
        }
    }

    const exists = (row, col) => {
        return !(row < 0 || row == rows || col < 0 || col == cols)
    }

    const allAdjacentBoxes = (row, col, func) => {
        if (exists(row - 1, col - 1)) func(matrix[row - 1][col - 1])
        if (exists(row - 1, col + 0)) func(matrix[row - 1][col + 0])
        if (exists(row - 1, col + 1)) func(matrix[row - 1][col + 1])

        if (exists(row + 0, col - 1)) func(matrix[row + 0][col - 1])
        if (exists(row + 0, col + 1)) func(matrix[row + 0][col + 1])

        if (exists(row + 1, col - 1)) func(matrix[row + 1][col - 1])
        if (exists(row + 1, col + 0)) func(matrix[row + 1][col + 0])
        if (exists(row + 1, col + 1)) func(matrix[row + 1][col + 1])
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

    const checkForWin = box => {
        if (!box.selected && ++cleared === allCleared) {
            alert('we made it')
        }
    }

    const reveal = (box) => {
        checkForWin(box)
        box.selected = true
        box.draw()

        const row = box.row
        const col = box.col

        if (box.count === 0) {
            const queue = []
            allAdjacentBoxes(row, col, adjacent => {
                if (!adjacent.selected && !queue.includes(adjacent)) {
                    queue.push(adjacent)
                }
            })
            while (queue.length > 0) {
                reveal(queue.pop())
            }
        }
    }

    const leftClick = (x, y) => {
        const box = boxLookup(x, y)
        if (!minesAssigned) {
            initMines(box)
        }
        if (box) {
            if (box.isMine) {
                box.selected = true
                box.draw()
                alert('dang')
            }
            reveal(box)
        }
    }

    const rightClick = (x, y, callback) => {
        const box = boxLookup(x, y)
        if (box) {
            box.marked = true
            box.draw()
            callback(numMines - ++foundMines)
        }
    }

    return {
        init, start, quit,
        hover, clear,
        leftClick, rightClick,
    }
}());