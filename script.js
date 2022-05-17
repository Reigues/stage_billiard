let context = canvas.getContext("2d")

let cursor = {
    x: 200,
    y: 200,
    radius: 20
}
let arrowEnd = {
    arg: Math.PI/2,
    r: 100,
    radius: 10
}
let offset = {
    top: canvas.offsetTop,
    left: canvas.offsetLeft
}

function draw(highlight=false) {
    context.clearRect(0, 0, 800, 600)
    //context.fillRect(cursor.x,cursor.y,cursor.width,cursor.height)
    context.beginPath();
    context.arc(cursor.x, cursor.y, cursor.radius, 0, 2 * Math.PI, false);
    context.fillStyle="black"
    context.fill();
    if (highlight) {
        context.lineWidth = 3;
        context.strokeStyle = 'gray';
        context.stroke();
    }
    context.beginPath();
    context.arc(cursor.x+arrowEnd.r*Math.cos(arrowEnd.arg),cursor.y+arrowEnd.r*Math.sin(arrowEnd.arg),arrowEnd.radius,0,2*Math.PI)
    context.fillStyle="blue"
    context.fill()
}

draw()

let inCursor = false;
let posInCursor = null

canvas.onmousemove = function (e) {
    //inCursor= e.clientX<=cursor.x+cursor.width+offset.left&&e.clientX>=cursor.x+offset.left&&e.clientY<=cursor.y+cursor.height+offset.top&&e.clientY>=cursor.y+offset.top;
    inCursor = Math.sqrt(Math.pow(e.clientX - cursor.x - offset.left, 2) + Math.pow(e.clientY - cursor.y - offset.top, 2)) <= cursor.radius

    if (posInCursor != null) {
        cursor.x = e.clientX - posInCursor.x - offset.left
        cursor.y = e.clientY - posInCursor.y - offset.top
    }
    draw(inCursor)
}

canvas.onmousedown = function (e) {
    if (posInCursor == null && inCursor) {
        posInCursor = { x: e.clientX - cursor.x - offset.left, y: e.clientY - cursor.y - offset.top }
    }
}
canvas.onmouseup = function (e) {
    posInCursor = null
}
canvas.onmouseleave = function () {
    posInCursor = null
    context.fillStyle = "black"
    draw()
}