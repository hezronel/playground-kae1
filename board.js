// --- Board ---

const W_KEY = 87;
const A_KEY = 65;
const D_KEY = 68;
const R_KEY = 114;

class Board {
    aObjs = []
    selectedRobot = null
    robots = []

    intervalDrawGame = null

    constructor(canvas, robots, aObjs) {
        this.canvas = canvas
        this.w = canvas.width
        this.h = canvas.height
        this.ctx = canvas.getContext("2d");
        this.aObjs = aObjs 
        this.robots = robots 
        this.selectedRobot = robots[0]

        for (let i in this.robots) {
            let rob = this.robots[i]
            rob.setBoard(this)
        }

        this.drawGame()
    }

    clearScreen() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.fillStyle = "rgb(246,244,241)";
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    drawRobot(rob) {
        // Robot Area
        // let elExtraSpace1 = (rob.diagonal - Math.max(rob.w,rob.h))/2
        // let elExtraSpace2 = (rob.diagonal - Math.min(rob.w,rob.h))/2
        // this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        // if (rob.w > rob.h) {
        //     this.ctx.fillRect(rob.x-elExtraSpace1 , rob.y-elExtraSpace2, rob.diagonal, rob.diagonal);
        // } else {
        //     this.ctx.fillRect(rob.x-elExtraSpace2 , rob.y-elExtraSpace1, rob.diagonal, rob.diagonal);
        // }

        this.ctx.translate(rob.x + rob.w/2, rob.y + rob.h/2);
        this.ctx.rotate(rob.dir * Math.PI / 180);
        this.ctx.translate(-(rob.w/2) - rob.x, -(rob.h/2) - rob.y);
        this.ctx.fillStyle = rob.color;
        this.ctx.fillRect(rob.x , rob.y, rob.w, rob.h);

        this.ctx.beginPath();
        this.ctx.arc(rob.x+rob.w-rob.diagonal/8-2, rob.y+rob.h/2, rob.diagonal/8, 0, 2 * Math.PI);
        this.ctx.fillStyle = rob.eyeColor1;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(rob.x+rob.w-rob.diagonal/12-2-rob.diagonal/12/2, rob.y+rob.h/2, rob.diagonal/12, 0, 2 * Math.PI);
        this.ctx.fillStyle = rob.eyeColor2;
        this.ctx.fill();
    }

    drawObj(obj) {
        this.ctx.fillStyle = obj.color;
        this.ctx.fillRect(obj.x , obj.y, obj.w, obj.h);
    }

    drawGame() {
        this.clearScreen();

        for (let i in this.aObjs) {
            let obj = this.aObjs[i]
            this.ctx.save();
            this.drawObj(obj) 
            this.ctx.restore();
        }
        
        for (let i in this.robots) {
            let rob = this.robots[i]
            this.ctx.save();
            this.drawRobot(rob) 
            this.ctx.restore();
        }
    }

    drawRobotMoveForward() {
        if (!this.selectedRobot) return;
        this.selectedRobot.stopAutoMove()
        this.selectedRobot.moveForward();
        if (!this.intervalDrawGame) this.drawGame()
    }

    drawRobotRotateLeft() {
        if (!this.selectedRobot) return;
        this.selectedRobot.stopAutoMove()
        this.selectedRobot.rotateLeft()
        if (!this.intervalDrawGame) this.drawGame()
    }

    drawRobotRotateRight() {
        if (!this.selectedRobot) return;
        this.selectedRobot.stopAutoMove()
        this.selectedRobot.rotateRight()
        if (!this.intervalDrawGame) this.drawGame()
    }

    isCollision(el, newX, newY) {
        var isCollision = false
        let aObjs = this.aObjs.concat(this.robots)
        for (var i = aObjs.length - 1; i >= 0; i--) {
            let aObj = aObjs[i]
            if (aObj == el) {
                continue
            }
            var left, right, top, bottom;
            let elExtraSpace1 = (el.w >= el.h) ? (el.diagonal - Math.max(el.w,el.h))/2 : (el.diagonal - Math.min(el.w,el.h))/2
            let elExtraSpace2 = (el.w >= el.h) ? (el.diagonal - Math.min(el.w,el.h))/2 : (el.diagonal - Math.max(el.w,el.h))/2
            let elWidth = el.diagonal - elExtraSpace1
            let elHeight = el.diagonal - elExtraSpace2

            let aObjExtraSpace1 = 0
            let aObjExtraSpace2 = 0
            let aObjWidth = aObj.w
            let aObjHeight = aObj.h
            if (aObj.isRobot) {
                aObjExtraSpace1 = (aObj.w >= aObj.h) ? (aObj.diagonal - Math.max(aObj.w,aObj.h))/2 : (aObj.diagonal - Math.min(aObj.w,aObj.h))/2
                aObjExtraSpace2 = (aObj.w >= aObj.h) ? (aObj.diagonal - Math.min(aObj.w,aObj.h))/2 : (aObj.diagonal - Math.max(aObj.w,aObj.h))/2
                aObjWidth = aObj.diagonal - aObjExtraSpace1
                aObjHeight = aObj.diagonal - aObjExtraSpace2
            }
            
            left    = newX + elWidth        < aObj.x - aObjExtraSpace1
            right   = newX - elExtraSpace1  > aObj.x + aObjWidth
            top     = newY + elHeight       < aObj.y - aObjExtraSpace2
            bottom  = newY - elExtraSpace2  > aObj.y + aObjHeight

            if (!(left || right || top || bottom)) {
                isCollision = true
                break
            }
        }
        return isCollision
    }

    stopAutoMove() {
        for (let i in this.robots) {
            let rob = this.robots[i]
            rob.stopAutoMove()
        }

        if (this.intervalDrawGame) {
            clearTimeout(this.intervalDrawGame)
            this.intervalDrawGame = null
        }
    }

    autoMove() {
        let self = this
        this.intervalDrawGame = setInterval(function() {
            self.drawGame();
        }, 100)

        for (let i in this.robots) {
            let rob = this.robots[i]
            rob.autoMove()
        }
    }

    keyDown(e) {
        if (e.keyCode == W_KEY) {
            this.drawRobotMoveForward()
        } else if (e.keyCode == A_KEY) {
            this.drawRobotRotateLeft()
        } else if (e.keyCode == D_KEY) {
            this.drawRobotRotateRight()
        }
    }

    keyPress(e) {
        if (e.keyCode == R_KEY) {
            if (this.intervalDrawGame) {
                if (this.selectedRobot && !this.selectedRobot.interval) {
                    this.selectedRobot.autoMove()
                } else {
                    this.stopAutoMove()
                }
            } else {
                this.autoMove()
            }
        }
    }

    mouseDown(e) {
        for (let i in this.robots) {
            let rob = this.robots[i]
            if (e.offsetX >= rob.x && 
                e.offsetY >= rob.y && 
                e.offsetX <= rob.x+rob.w && 
                e.offsetY <= rob.y+rob.h) {
                this.selectedRobot = rob
                break
            }
        }
    }
}