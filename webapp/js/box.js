
const createBox = (ctx, x, y, width, height) => {
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

    const padding = 20
    const radius = (width - padding) / 2

    const minx = x + (padding / 2)
    const miny = y + (padding / 2)
    const maxx = minx + width - padding
    const maxy = miny + height - padding
    const centerx = minx + radius
    const centery = miny + radius

    const drawBorder = () => {
        ctx.strokeStyle = lineColor
        ctx.strokeRect(x, y, width, height)
    }

    const drawX = () => {
        ctx.strokeStyle = lineColor
        ctx.moveTo(minx, miny)
        ctx.lineTo(maxx, maxy)
        ctx.moveTo(minx, maxy)
        ctx.lineTo(maxx, miny)
        ctx.stroke()
    }

    const drawO = () => {
        ctx.strokeStyle = lineColor
        ctx.beginPath()
        ctx.arc(centerx, centery, radius, 0, 2 * Math.PI)
        ctx.stroke()
    }

    const drawNum = count => {
        if (count > 0) {
            ctx.fillStyle = countColors[count]
            ctx.fillText(count, minx, maxy)
        }
    }

    return {
        isMine: false,
        selected: false,
        marked: false,
        count: 0,

        draw: function () {
            if (this.selected) {
                // selected, reveal symbol
                ctx.clearRect(x, y, width, height)
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

        fillBox: function (color) {
            ctx.fillStyle = color
            ctx.fillRect(x, y, width, height)
        },

        hover: function () {
            this.fillBox(hoverColor)
        },
    }
}
