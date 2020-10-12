/*
 * Functions for interacting with the minesweper matrix
 */

// canvas props
const font = '30px "Lucida Console", Monaco, monospace'
const lineWdith = 2
const canvasPadding = 10

// matrix dimensions
const rows = 16
const cols = 16
const numMines = 40
const allCleared = (rows * cols) - numMines

// does (row, col) exist in matrix
const exists = (row, col) => {
    return 0 <= row && row < rows && 0 <= col && col < cols
}

// controller for all the game boxes
const matrix = {
    boxes: [],
    hasMines: false,
    xres: 0,
    yres: 0,

    get: function (row, col) {
        return this.boxes[row][col]
    },

    // init matrix
    init: function (ctx) {
        // init style
        ctx.lineWidth = lineWdith
        ctx.font = font

        const width = ctx.canvas.width - canvasPadding * 2
        const height = ctx.canvas.height - canvasPadding * 2

        this.xres = width / cols
        this.yres = height / rows

        for (let row = 0, y = canvasPadding; row < rows; row++, y += this.yres) {
            const m = []
            for (let col = 0, x = canvasPadding; col < cols; col++, x += this.xres) {
                const box = createBox(ctx, x, y, row, col, this.xres, this.yres)
                box.draw()
                m.push(box)
            }
            this.boxes.push(m)
        }
    },

    forEach: function (func) {
        this.boxes.forEach(row => {
            row.forEach(box => func(box))
        })
    },

    // reset all boxes
    reset: function () {
        this.hasMines = false
        this.forEach(box => box.reset())
    },

    // apply function to all adjacent boxes
    map: function (row, col, func) {
        if (exists(row - 1, col - 1)) func(this.boxes[row - 1][col - 1])
        if (exists(row - 1, col + 0)) func(this.boxes[row - 1][col + 0])
        if (exists(row - 1, col + 1)) func(this.boxes[row - 1][col + 1])

        if (exists(row + 0, col - 1)) func(this.boxes[row + 0][col - 1])
        if (exists(row + 0, col + 1)) func(this.boxes[row + 0][col + 1])

        if (exists(row + 1, col - 1)) func(this.boxes[row + 1][col - 1])
        if (exists(row + 1, col + 0)) func(this.boxes[row + 1][col + 0])
        if (exists(row + 1, col + 1)) func(this.boxes[row + 1][col + 1])
    },

    // check if (row, col) is adjacent to box
    isAdjacent: function (box, row, col) {
        let notAllowed = row === box.row && col === box.col
        this.map(box.row, box.col, adjacent => {
            if (row === adjacent.row && col === adjacent.col) {
                notAllowed = true
            }
        })
        return notAllowed
    },

    // map pixel coord (x, y) to box
    lookup: function (point) {
        const col = Math.floor((point.x - canvasPadding) / this.xres)
        const row = Math.floor((point.y - canvasPadding) / this.yres)
        return exists(row, col) ? this.get(row, col) : false
    },

    // assign locations to the mines
    // NOTE: mines cannot be adjacent to the first clicked box
    placeMines: function (clickedBox) {
        this.hasMines = true

        // assign mines
        for (let i = 0, searching = true; i < numMines; i++, searching = true) {
            while (searching) {
                const row = Math.floor(Math.random() * rows)
                const col = Math.floor(Math.random() * cols)

                if (this.isAdjacent(clickedBox, row, col)) continue

                const box = this.get(row, col)
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
                this.map(row, col, box => {
                    if (box.isMine) count++
                })
                this.get(row, col).count = count
            }
        }
    },
}