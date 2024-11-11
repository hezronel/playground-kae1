// --- Robot ---

const MAX_SIZE = 60
const MIN_SIZE = 20

class Robot {
    x = 0
    y = 0
    dir = 0
    width = 50
    height = 50
    diagonal = 70.71067

    bodyColor = "rgb(225,90,29)"
    eyeColor1 = "white"
    eyeColor2 = "rgb(51,51,51)"

    speed = 10
    isMoveForward = false

    board = null

    timeout = null
    interval = null
    
    constructor(x,y,dir,width,height,bodyColor,eyeColor1,eyeColor2) {
        this.x = x
        this.y = y
        this.dir = dir
        
        this.width = Math.max(Math.min(width,MAX_SIZE),MIN_SIZE)
        this.height = Math.max(Math.min(height,MAX_SIZE),MIN_SIZE)
        this.diagonal = Math.sqrt(Math.pow(this.width,2) + Math.pow(this.height,2));

        if (bodyColor) this.bodyColor = bodyColor
        if (eyeColor1) this.eyeColor1 = eyeColor1
        if (eyeColor2) this.eyeColor2 = eyeColor2

        this.speed = this.getMovementSpeed(this.width,this.height)
    }

    getMovementSpeed(w,h) {
        let a = w*h
        // let s = -Math.pow(a/100,2)/90 + 20
        // console.log(a/100," x ",s)

        let r = (a/(MAX_SIZE*MAX_SIZE))*(Math.PI/18)
        let s = 12*Math.pow(Math.cos(6*r),2)
        // console.log(a," x ",s)

        return s
    }

    setBoard(board) {
        this.board = board
        if (!this.setNewPosition(this.x,this.y)) {
            this.x = (this.diagonal - Math.max(this.width,this.height))/2
            this.y = (this.diagonal - Math.min(this.width,this.height))/2
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
            lW = x >= (this.diagonal - Math.max(this.width,this.height))/2
            rW = this.board.width >= x + this.diagonal - (this.diagonal - Math.max(this.width,this.height))/2
            tW = y >= (this.diagonal - Math.min(this.width,this.height))/2
            bW = this.board.height >= y + this.diagonal - (this.diagonal - Math.min(this.width,this.height))/2
        } else {
            lW = x >= (this.diagonal - Math.min(this.width,this.height))/2
            rW = this.board.width >= x + this.diagonal - (this.diagonal - Math.min(this.width,this.height))/2
            tW = y >= (this.diagonal - Math.max(this.width,this.height))/2
            bW = this.board.height >= y + this.diagonal - (this.diagonal - Math.max(this.width,this.height))/2
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
        let newDir = this.dir + this.speed
        this.dir = newDir > 360 ? newDir-360 : newDir
        this.isMoveForward = false
        return this.dir
    }
    
    rotateLeft() {
        let newDir = this.dir - this.speed
        this.dir = newDir < 0 ? newDir+360 : newDir
        this.isMoveForward = false
        return this.dir
    }
    
    moveForward() {
        let radians = this.dir * Math.PI/180;
        let x = (this.x * Math.pow(10,15) + this.speed * Math.cos(radians).toFixed(15) * Math.pow(10,15))/Math.pow(10,15);
        let y = (this.y * Math.pow(10,15) + this.speed * Math.sin(radians).toFixed(15) * Math.pow(10,15))/Math.pow(10,15);
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

        let currentDir = this.dir
        let self = this;

        this.interval = setInterval(function() {
            if (nextMove == 0) {
                if (!self.moveForward()) {
                    self.autoMove()
                }
            } else if (nextMove == 1) {
                let newDir = self.rotateLeft()
                if (Math.abs(newDir-currentDir) > 180) {
                    self.autoMove()
                }
            } else if (nextMove == 2) {
                let newDir = self.rotateRight()
                if (Math.abs(newDir-currentDir) > 180) {
                    self.autoMove()
                }
            }
        }, 100)

        this.timeout = setTimeout(function() {
            self.autoMove()
        }, randomTimer * 1000)
    }
}