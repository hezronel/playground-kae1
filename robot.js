// --- Robot ---

class Robot {
    x = 0
    y = 0
    dir = 0
    width = 50
    height = 50
    maxSize = 70.71067

    bodyColor = "rgb(225,90,29)"
    eyeColor1 = "white"
    eyeColor2 = "rgb(51,51,51)"

    speedMove = 10
    speedRotate = 10
    isMoveForward = false

    board = null

    timeout = null
    interval = null
    
    constructor(x,y,dir,width,height,speedMove,bodyColor,eyeColor1,eyeColor2) {
        if (bodyColor) this.bodyColor = bodyColor
        if (eyeColor1) this.eyeColor1 = eyeColor1
        if (eyeColor2) this.eyeColor2 = eyeColor2
        if (speedMove) this.speedMove = speedMove
        if (speedMove) this.speedRotate = speedMove
        this.width = width
        this.height = height
        this.dir = dir
        let maxSize = Math.sqrt(Math.pow(this.width,2) + Math.pow(this.height,2));
        this.maxSize = maxSize
        this.x = x
        this.y = y
    }

    setBoard(board) {
        this.board = board
        if (!this.setNewPosition(this.x,this.y)) {
            this.x = (this.maxSize - Math.max(this.width,this.height))/2
            this.y = (this.maxSize - Math.min(this.width,this.height))/2
            if (this.width < this.height) {
                let temp = this.x
                this.x = this.y
                this.y = temp
            }
        }
    }
    
    setNewPosition(x,y) {
        var lW, rW, tW, bW;
        if (this.width > this.height) {
            lW = x >= (this.maxSize - Math.max(this.width,this.height))/2
            rW = this.board.width >= x + this.maxSize - (this.maxSize - Math.max(this.width,this.height))/2
            tW = y >= (this.maxSize - Math.min(this.width,this.height))/2
            bW = this.board.height >= y + this.maxSize - (this.maxSize - Math.min(this.width,this.height))/2
        } else {
            lW = x >= (this.maxSize - Math.min(this.width,this.height))/2
            rW = this.board.width >= x + this.maxSize - (this.maxSize - Math.min(this.width,this.height))/2
            tW = y >= (this.maxSize - Math.max(this.width,this.height))/2
            bW = this.board.height >= y + this.maxSize - (this.maxSize - Math.max(this.width,this.height))/2
        }
        if (lW && rW && tW && bW) {
            this.x = x;
            this.y = y;
            return true
        } else {
            return false
        }
    }
    
    rotateRight() {
        let newDir = this.dir + this.speedRotate
        this.dir = newDir > 360 ? newDir-360 : newDir
        this.isMoveForward = false
    }
    
    rotateLeft() {
        let newDir = this.dir - this.speedRotate
        this.dir = newDir < 0 ? newDir+360 : newDir
        this.isMoveForward = false
    }
    
    moveForward() {
        let radians = this.dir * Math.PI/180;
        let x = (this.x * Math.pow(10,15) + this.speedMove * Math.cos(radians).toFixed(15) * Math.pow(10,15))/Math.pow(10,15);
        let y = (this.y * Math.pow(10,15) + this.speedMove * Math.sin(radians).toFixed(15) * Math.pow(10,15))/Math.pow(10,15);
        this.isMoveForward = true
        return this.setNewPosition(x, y)
    }

    stopAutoMove() {
        if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = null
        }

        if (this.interval) {
            clearTimeout(this.interval)
            this.interval = null
        }
    }

    autoMove() {
        this.stopAutoMove()

        this.isMoveForward = !this.isMoveForward
        let randomTimer = this.isMoveForward ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 2) + 0.5
        let nextMove = this.isMoveForward ? 0 : Math.floor(Math.random() * 2) + 1

        let self = this;

        this.interval = setInterval(function() {
            if (nextMove == 0) {
                if (!self.moveForward()) {
                    self.autoMove()
                }
            } else if (nextMove == 1) {
                self.rotateLeft()
            } else if (nextMove == 2) {
                self.rotateRight()
            }
        }, 100)

        this.timeout = setTimeout(function() {
            self.autoMove()
        }, randomTimer * 1000)
    }
}