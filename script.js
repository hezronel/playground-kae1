// --- Robot ---

class Robot {
    x = 0
    y = 0
    dir = 0
    grid = null
    speedMove = 10
    speedRotate = 10
    width = 50
    height = 50
    maxSize = 70.71067
    
    constructor(x,y,dir,width,height,grid) {
        this.grid = grid
        this.width = width
        this.height = height
        this.dir = dir
        let maxSize = Math.sqrt(Math.pow(this.width,2) + Math.pow(this.height,2));
        this.maxSize = maxSize
        this.x = (this.maxSize - Math.max(this.width,this.height))/2
        this.y = (this.maxSize - Math.min(this.width,this.height))/2
        if (this.width < this.height) {
            let temp = this.x
            this.x = this.y
            this.y = temp
        }
        this.setPosition(x,y)
    }
    
    setPosition(x,y) {
        var lW, rW, tW, bW;
        if (this.width > this.height) {
            lW = x >= (this.maxSize - Math.max(this.width,this.height))/2
            rW = this.grid.width >= x + this.maxSize - (this.maxSize - Math.max(this.width,this.height))/2
            tW = y >= (this.maxSize - Math.min(this.width,this.height))/2
            bW = this.grid.height >= y + this.maxSize - (this.maxSize - Math.min(this.width,this.height))/2
        } else {
            lW = x >= (this.maxSize - Math.min(this.width,this.height))/2
            rW = this.grid.width >= x + this.maxSize - (this.maxSize - Math.min(this.width,this.height))/2
            tW = y >= (this.maxSize - Math.max(this.width,this.height))/2
            bW = this.grid.height >= y + this.maxSize - (this.maxSize - Math.max(this.width,this.height))/2
        }
        if (lW && rW && tW && bW) {
            this.x = x;
            this.y = y;   
        }
    }
    
    rotateRight() {
        let newDir = this.dir + this.speedRotate
        this.dir = newDir > 360 ? newDir-360 : newDir
    }
    
    rotateLeft() {
        let newDir = this.dir - this.speedRotate
        this.dir = newDir < 0 ? newDir+360 : newDir
    }
    
    moveForward() {
        let radians = this.dir * Math.PI/180;
        let x = (this.x * Math.pow(10,15) + this.speedMove * Math.cos(radians).toFixed(15) * Math.pow(10,15))/Math.pow(10,15);
        let y = (this.y * Math.pow(10,15) + this.speedMove * Math.sin(radians).toFixed(15) * Math.pow(10,15))/Math.pow(10,15);
        this.setPosition(x, y)
    }
}

// --- Canvas ---

let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");  

function clearScreen() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawRobot() {
    ctx.translate(rob.x + rob.width/2, rob.y + rob.height/2);
    ctx.rotate(rob.dir * Math.PI / 180);
    ctx.translate(-(rob.width/2) - rob.x, -(rob.height/2) - rob.y);
    ctx.fillStyle = "rgb(225,90,29)";
    ctx.fillRect(rob.x , rob.y, rob.width, rob.height);

    ctx.beginPath();
    ctx.arc(rob.x+rob.width-rob.maxSize/8-2, rob.y+rob.height/2, rob.maxSize/8, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(rob.x+rob.width-rob.maxSize/12-2-rob.maxSize/12/2, rob.y+rob.height/2, rob.maxSize/12, 0, 2 * Math.PI);
    ctx.fillStyle = "rgb(51,51,51)";
    ctx.fill();
}

function drawGame() {
    clearScreen();
    ctx.save();
    drawRobot()
    ctx.restore();
}

function objMoveForward() {
    rob.moveForward();
    drawGame();
}

function objRotateLeft() {
    rob.rotateLeft()
    drawGame();
}

function objRotateRight() {
    rob.rotateRight()
    drawGame();
}

document.onkeydown = function (e) {
    e = e || window.event;
    if (e.keyCode == 87) {
        // press "W"
        stopAutoMove()
        objMoveForward()
    } else if (e.keyCode == 65) {
        // press "A"
        stopAutoMove()
        objRotateLeft()
    } else if (e.keyCode == 68) {
        // press "D"
        stopAutoMove()
        objRotateRight()
    } else if (e.keyCode == 83) {
        // press "S"
    }
};

document.onkeypress = function (e) {
    e = e || window.event;
    if (e.keyCode == 114) {
        // press "R"
        if (timeout || interval) {
            stopAutoMove()
        } else {
            autoMove()
        }
    }
};

var wasRotate = false
var timeout = null
var interval = null

function stopAutoMove() {
    if (timeout) {
        clearTimeout(timeout)
        timeout = null
    }

    if (interval) {
        clearTimeout(interval)
        interval = null
    }
}

function autoMove() {
    stopAutoMove()

    wasRotate = !wasRotate
    let randomTimer = wasRotate ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 2) + 0.5
    let nextMove = wasRotate ? 0 : Math.floor(Math.random() * 2) + 1

    interval = setInterval(function() {
        if (nextMove == 0) {
            objMoveForward()
        } else if (nextMove == 1) {
            objRotateLeft()
        } else if (nextMove == 2) {
            objRotateRight()
        }
    }, 100)

    timeout = setTimeout(function() {
        autoMove()
    }, randomTimer * 1000)
}

var rob = new Robot(80,80,30,50,50,canvas)
drawGame()