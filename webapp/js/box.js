/*
 * Game logic for drawing and updating a box
 */

// game colors
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

// constructor for box
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

    // draw box border
    const drawBorder = () => {
        ctx.strokeStyle = lineColor
        ctx.strokeRect(x, y, width, height)
    }

    // draw X for mine
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

    // draw number on box
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

        // reset box for new game
        reset: function () {
            this.isMine = false
            this.selected = false
            this.marked = false
            this.count = 0
            this.draw()
        },

        // box selected
        select: function () {
            this.selected = true
            this.draw()
            if (this.marked) {
                state.update(numMines - --state.foundMines)
            }
        },

        // box marked as mine
        mark: function () {
            this.marked = true
            this.draw()
        },

        fillBox: function (color) {
            ctx.fillStyle = color
            ctx.fillRect(x, y, width, height)
        },

        // color for hover
        hover: function () {
            this.fillBox(hoverColor)
        },

        // update this box
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

        // reveal miens as circles
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