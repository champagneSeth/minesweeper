
const lineColor = 'darkgrey'
const unselectedColor = 'gainsboro'
const markedColor = 'darksalmon'
const hoverColor = 'cornflowerblue'

const countColors = [
    'darkgrey',     // 0
    'darkseagreen', // 1
    'goldenrod',    // 2
    'crimson',      // 3
    'chocolate',    // 4
    'hotpink',      // 5
    'fuschia',      // 6
    'indigo',       // 7
    'navy'          // 8
]

const font = '30px "Lucida Console", Monaco, monospace'
const lineWdith = 2
const canvasPadding = 10

const rows = 16
const cols = 16
const numMines = 40
const allCleared = (rows * cols) - numMines

// does (row, col) exist in matrix
const exists = (row, col) => {
    return 0 <= row && row < rows && 0 <= col && col < cols
}

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
            row.forEach(box => {
                func(box)
            })
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
    // mines cannot be adjacent to the first clicked box
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

const createBox = (ctx, x, y, row, col, width, height) => {
    const padding = 20
    const radius = (width - padding) / 2

    const minx = x + (padding / 2)
    const miny = y + (padding / 2)
    const maxx = minx + width - padding
    const maxy = miny + height - padding
    const centerx = minx + radius
    const centery = miny + radius

    const clear = () => {
        ctx.clearRect(x, y, width, height)
    }

    const drawBorder = () => {
        ctx.strokeStyle = lineColor
        ctx.strokeRect(x, y, width, height)
    }

    const drawX = () => {
        ctx.strokeStyle = lineColor
        ctx.beginPath()
        ctx.moveTo(minx, miny)
        ctx.lineTo(maxx, maxy)
        ctx.moveTo(minx, maxy)
        ctx.lineTo(maxx, miny)
        ctx.closePath()
        ctx.stroke()
    }

    const drawNum = count => {
        if (count > 0) {
            ctx.fillStyle = countColors[count]
            ctx.fillText(count, minx, maxy)
        }
    }

    return {
        row: row,
        col: col,
        isMine: false,
        selected: false,
        marked: false,
        count: 0,

        reset: function () {
            this.isMine = false
            this.selected = false
            this.marked = false
            this.count = 0
            this.draw()
        },

        select: function () {
            this.selected = true
            this.draw()
            if (this.marked) {
                state.update(numMines - --state.foundMines)
            }
        },

        mark: function () {
            this.marked = true
            this.draw()
        },

        fillBox: function (color) {
            ctx.fillStyle = color
            ctx.fillRect(x, y, width, height)
        },

        hover: function () {
            this.fillBox(hoverColor)
        },

        draw: function () {
            if (this.selected) {
                // selected, reveal symbol
                clear()
                this.isMine ? drawX() : drawNum(this.count)
            } else if (this.marked) {
                // marked as mine
                this.fillBox(markedColor)
            } else {
                // not selected
                this.fillBox(unselectedColor)
            }

            // draw border
            drawBorder()
        },

        win: function () {
            if (this.isMine) {
                this.selected = true
                clear()
                drawBorder()

                // draw circle
                ctx.strokeStyle = lineColor
                ctx.beginPath()
                ctx.arc(centerx, centery, radius, 0, 2 * Math.PI)
                ctx.stroke()
            }
        },
    }
}