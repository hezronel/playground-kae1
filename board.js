// --- Board ---

const W_KEY = 87;
const A_KEY = 65;
const D_KEY = 68;
const R_KEY = 114;

class Board {
    canvas = null
    ctx = null
    w = 0
    h = 0

    selectedRobot = null
    robots = []

    intervalDrawGame = null

    constructor(canvas, robots) {
        this.canvas = canvas
        this.w = canvas.width
        this.h = canvas.height
        this.ctx = canvas.getContext("2d");
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
        this.ctx.translate(rob.x + rob.w/2, rob.y + rob.h/2);
        this.ctx.rotate(rob.dir * Math.PI / 180);
        this.ctx.translate(-(rob.w/2) - rob.x, -(rob.h/2) - rob.y);
        this.ctx.fillStyle = rob.bodyColor;
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

    drawGame() {
        this.clearScreen();
        
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