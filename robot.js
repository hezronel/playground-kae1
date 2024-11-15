// --- Robot ---

const MAX_SIZE = 60
const MIN_SIZE = 20

class Robot extends Rect {
    isRobot = true

    isMoveForward = false

    board = null

    timeout = null
    interval = null
    
    constructor(x,y,dir,w,h,color="rgb(225,90,29)",eyeColor1="white",eyeColor2="rgb(51,51,51)") {
        super(x,y,w,h,color)
        this.dir = dir
        
        this.w = Math.max(Math.min(this.w,MAX_SIZE),MIN_SIZE)
        this.h = Math.max(Math.min(this.h,MAX_SIZE),MIN_SIZE)
        this.diagonal = Math.sqrt(Math.pow(this.w,2) + Math.pow(this.h,2));

        this.eyeColor1 = eyeColor1
        this.eyeColor2 = eyeColor2

        this.speed = this.getSpeed(this.w,this.h)
    }

    getSpeed(w,h) {
        let a = w*h
        let r = (a/(MAX_SIZE*MAX_SIZE))*(Math.PI/18)
        let s = 12*Math.pow(Math.cos(6*r),2)
        return s
    }

    setBoard(board) {
        this.board = board
        if (board.isCollision(this, this.x,this.y)) {
            var x = (this.diagonal - Math.max(this.w,this.h))/2
            var y = (this.diagonal - Math.min(this.w,this.h))/2
            if (this.w < this.h) {
                let temp = x
                x = y
                y = temp
            }
            this.setNewPosition(x,y)
        }
    }
    
    setNewPosition(x,y) {
        this.x = x;
        this.y = y;
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
        if (!board.isCollision(this,x,y)) {
            this.setNewPosition(x, y)
            return true
        } else {
            return false
        }
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