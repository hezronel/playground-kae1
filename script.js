// --- Main ---

let canvas = document.getElementById("game");

let robOr = new Robot(100,200,0,50,50,7)
let robDB = new Robot(30,30,50,45,20,10,"rgb(10,52,99)")
let robGd = new Robot(300,300,230,25,55,10,"rgb(255,223,0)","rgb(230,190,138)","white")
let robRd = new Robot(300,50,150,25,25,20,"red")
let board = new Board(canvas,[robOr, robDB, robGd, robRd])

document.onkeydown = function (e) {
    e = e || window.event;
    board.keyDown(e)
};

document.onkeypress = function (e) {
    e = e || window.event;
    board.keyPress(e)
};