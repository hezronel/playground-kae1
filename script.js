// --- Main ---

let canvas = document.getElementById("board");

let robOr = new Robot(50,200,0,50,50)
let robDB = new Robot(30,30,50,45,20,"rgb(10,52,99)")
let robGd = new Robot(300,300,230,25,55,"rgb(255,223,0)","rgb(230,190,138)","white")
let robPp = new Robot(300,50,150,20,20,"purple")
let robGr = new Robot(300,200,90,60,60,"green")

let wallTop = new Rect(0,0,canvas.width,2)
let wallLeft = new Rect(0,0,2,canvas.height)
let wallRight = new Rect(canvas.width-2,0,2,canvas.height)
let wallBottom = new Rect(0,canvas.height-2,canvas.width,2)

let rectCenterBlack = new Rect(canvas.width/2-70,canvas.height/2-25,140,50)
let rectCenterWhite = new Rect(canvas.width/2-15,canvas.height/2-15,30,30, "white")

let board = new Board(
    canvas,
    [robOr, robDB, robGd, robPp, robGr], 
    [wallTop, wallLeft, wallRight, wallBottom, rectCenterBlack, rectCenterWhite]
)

document.onkeydown = function (e) {
    e = e || window.event;
    board.keyDown(e)
};

document.onkeypress = function (e) {
    e = e || window.event;
    board.keyPress(e)
};

canvas.onmousedown = function (e) {
    e = e || window.event;
    board.mouseDown(e)
};