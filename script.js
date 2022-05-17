let context = canvas.getContext("2d")

cursor = {
    x:10,
    y:10,
    width:100,
    height:100
}
context.fillRect(cursor)

inCursor = true

canvas.onmousemove=function(e){
    if (inCursor) {
        context.fillStyle="red"
        context.fillRect(cursor)
    } else {
        context.fillStyle="black"
        context.fillRect(cursor)
    }
}