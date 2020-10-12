/*
 * Controller for the game
 */

// game state
const state = {
    playing: false,
    numMines: 40,
    foundMines: 0,
    cleared: 0,

    // NOTE: override these callbacks
    win: () => { },
    lose: () => { },
    update: () => { },
}

// game logic
const minesweeper = (function () {

    // start new game
    const start = () => {
        matrix.reset()
        state.playing = true
        state.foundMines = 0
        state.cleared = 0
        state.update(numMines)
    }

    // end game
    const quit = () => {
        state.playing = false
        matrix.forEach(box => box.select())
    }

    // update hover
    let hoverBox
    const hover = (point) => {
        if (hoverBox) hoverBox.draw()
        hoverBox = matrix.lookup(point)
        if (hoverBox && !hoverBox.selected) hoverBox.hover()
    }

    // check if game finished
    const checkForWin = box => {
        if (!box.selected && ++state.cleared === allCleared) {
            matrix.forEach(box => box.win())
            state.playing = false
            state.win('we made it')
        }
    }

    // reveal safe boxes adjacent to clicked box
    const reveal = (box) => {
        checkForWin(box)
        box.select()

        const row = box.row
        const col = box.col

        if (box.count === 0) {
            const queue = []
            matrix.map(row, col, adjacent => {
                if (!adjacent.selected && !queue.includes(adjacent)) {
                    queue.push(adjacent)
                }
            })
            while (queue.length > 0) {
                reveal(queue.pop())
            }
        }
    }

    const leftClick = (point) => {
        const box = matrix.lookup(point)
        if (!matrix.hasMines) {
            matrix.placeMines(box)
        }
        if (box) {
            if (box.isMine) {
                quit()
                state.lose('dang')
            }
            reveal(box)
        }
    }

    const rightClick = (point) => {
        const box = matrix.lookup(point)
        if (box) {
            box.mark()
            state.update(numMines - ++state.foundMines)
        }
    }

    return { start, quit, hover, leftClick, rightClick, }
}());