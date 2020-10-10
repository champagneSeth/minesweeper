
const createBox = (ctx, x, y, width, height) => {
    const unselectedColor = "gainsboro"
    const markedColor = "darksalmon"
    const padding = 20
    const radius = (width - padding) / 2

    const minx = x + (padding / 2)
    const miny = y + (padding / 2)
    const maxx = minx + width - padding
    const maxy = miny + height - padding
    const centerx = minx + radius
    const centery = miny + radius

    const drawX = () => {
        ctx.moveTo(minx, miny)
        ctx.lineTo(maxx, maxy)
        ctx.moveTo(minx, maxy)
        ctx.lineTo(maxx, miny)
        ctx.stroke()
    }

    const drawO = () => {
        ctx.beginPath()
        ctx.arc(centerx, centery, radius, 0, 2 * Math.PI)
        ctx.stroke()
    }

    return {
        isMine: false,
        selected: false,
        marked: false,

        draw: function () {
            if (this.selected) {
                // selected, reveal symbol
                ctx.clearRect(x, y, width, height)
                this.isMine ? drawX() : drawO()
            } else if (this.marked) {
                // marked as mine
                this.fillBox(markedColor)
            } else {
                // not selected
                this.fillBox(unselectedColor)
            }

            // draw border
            ctx.strokeRect(x, y, width, height)
        },

        fillBox: function (color) {
            ctx.fillStyle = color
            ctx.fillRect(x, y, width, height)
        },
    }
}
