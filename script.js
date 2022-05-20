function behavior(point, direction, line) {
    let lineAngle = Math.atan2(line.v.y-line.u.y,line.v.x-line.u.x)
    return {point:point,direction:2*lineAngle-direction}    
}

let context = canvas.getContext("2d")

let figure=[{x:300,y:400},{x:600,y:400},{x:450,y:400-150*Math.sqrt(3)}]
let cursor = {
    x: 200,
    y: 200,
    radius: 20
}
let arrowEnd = {
    arg: 0.713724379,
    r: 100,
    radius: 10
}
let points=new Array(10)
let last_direction=arrowEnd.arg
let offset = {
    top: canvas.offsetTop,
    left: canvas.offsetLeft
}

let line_colors=["green","red"]

function canvas_arrow(context, fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
}

function draw(highlight_cursor=false, highlight_arrowEnd=false) {

    context.clearRect(0, 0, canvas.width, canvas.height)
    //context.fillRect(cursor.x,cursor.y,cursor.width,cursor.height)
    context.beginPath();
    context.moveTo(figure[figure.length-1].x,figure[figure.length-1].y)
    for (let i = 0; i < figure.length; i++) {
        context.lineTo(figure[i].x,figure[i].y)
    }
    context.lineWidth = 3;
    context.strokeStyle = 'black';
    context.stroke();
    context.beginPath();
    context.arc(cursor.x, cursor.y, cursor.radius, 0, 2 * Math.PI, false);
    context.fillStyle="black"
    context.fill();
    if (highlight_cursor) {
        context.lineWidth = 3;
        context.strokeStyle = 'blue';
        context.stroke();
    }
    context.beginPath()
    canvas_arrow(context,cursor.x,cursor.y,cursor.x+arrowEnd.r*Math.cos(arrowEnd.arg), cursor.y+arrowEnd.r*Math.sin(arrowEnd.arg))
    context.strokeStyle="black"
    context.stroke()
    if (highlight_arrowEnd) {
        context.beginPath()
        context.arc(cursor.x+arrowEnd.r*Math.cos(arrowEnd.arg), cursor.y+arrowEnd.r*Math.sin(arrowEnd.arg),arrowEnd.radius,0,2*Math.PI)
        context.lineWidth = 3;
        context.strokeStyle = 'blue';
        context.stroke();
    }
    /* let newPoint = nextPoint(cursor,arrowEnd.arg)
    if (newPoint!=null) {
        context.beginPath();
        context.moveTo(newPoint.x, newPoint.y);
        context.lineTo(newPoint.x+1000*Math.cos(newPoint.direction), newPoint.y+1000*Math.sin(newPoint.direction));
        context.strokeStyle = 'green';
        context.stroke();
    } */
    for (let i = 0; i < points.length-1&&points[i]!=null; i++) {
        if (points[i+1]==null) {
            context.beginPath();
            context.moveTo(points[i].x, points[i].y);
            context.lineTo(points[i].x+1000*Math.cos(last_direction), points[i].y+1000*Math.sin(last_direction));
            context.strokeStyle = line_colors[i%2];
            context.stroke();   
        } else {
            context.beginPath();
            context.moveTo(points[i].x, points[i].y);
            context.lineTo(points[i+1].x, points[i+1].y);
            context.strokeStyle = line_colors[i%2];
            context.stroke();
            context.beginPath();
            context.arc(points[i+1].x, points[i+1].y, 5, 0, 2 * Math.PI, false);
            context.fillStyle=line_colors[i%2]
            context.fill();
        }
    }
}

function nextPoint(point,direction) {
    let line = null
    let temp_point={x:point.x+1000*Math.cos(direction),y:point.y+1000*Math.sin(direction)}
    for (let i = 0; i < figure.length; i++) {
        if (i==figure.length-1) {
            ip1=0
        }else{
            ip1=i+1
        }
        if(doIntersect({u:figure[i],v:figure[ip1]}, {u:{x:point.x+Math.cos(direction),y:point.y+Math.sin(direction)},v:{x:temp_point.x+Math.cos(direction),y:temp_point.y+Math.sin(direction)}})){
            line={u:figure[i],v:figure[ip1]}
            let result = line_intersect(line, {u:point,v:{x:point.x+Math.cos(direction),y:point.y+Math.sin(direction)}})
            temp_point = {x:result.x,y:result.y}
        }
    }
    /* a1=Math.tan(direction)
    b1=point.y-a1* */
    let newPointDirection = null
    if (line!=null) {
        newPointDirection = behavior(temp_point,direction,line)
    }
    return newPointDirection
}

function createPoints(){
    last_direction=arrowEnd.arg
    points=new Array(parseInt(lineNumber_input.value)+1)
    points[0]=cursor
    let result=null
    for (let i = 0; i < points.length-1 && points[i]!=null; i++) {
        result = nextPoint(points[i],last_direction)
        points[i+1]=result!=null ? result.point : null
        last_direction=result!=null ? result.direction : last_direction
    }
}

createPoints()
draw()

let inCursor = false;
let posInCursor = null

let inArrowEnd = false;
let posInArrowEnd = null;
let initialPos = null;

canvas.onmousemove = function (e) {
    //inCursor= e.clientX<=cursor.x+cursor.width+offset.left&&e.clientX>=cursor.x+offset.left&&e.clientY<=cursor.y+cursor.height+offset.top&&e.clientY>=cursor.y+offset.top;
    inCursor = Math.sqrt(Math.pow(e.clientX - cursor.x - offset.left, 2) + Math.pow(e.clientY - cursor.y - offset.top, 2)) <= cursor.radius
    inArrowEnd = Math.sqrt(Math.pow(e.clientX - (cursor.x+arrowEnd.r*Math.cos(arrowEnd.arg)) - offset.left, 2) + Math.pow(e.clientY - (cursor.y+arrowEnd.r*Math.sin(arrowEnd.arg)) - offset.top, 2)) <= arrowEnd.radius

    if (posInCursor != null) {
        cursor.x = initialPos.x - Math.pow(10,-range_input.value+1)*(initialPos.x - e.clientX) - posInCursor.x - offset.left
        cursor.y = initialPos.y - Math.pow(10,-range_input.value+1)*(initialPos.y - e.clientY) - posInCursor.y - offset.top
        createPoints()
    }
    if (posInArrowEnd != null) {
        arrowEnd.arg = posInArrowEnd.arg + initialPos.arg - Math.pow(10,-range_input.value+1)*(initialPos.arg - Math.atan2((e.clientY - cursor.y - offset.top),(e.clientX - cursor.x - offset.left)))
        createPoints()
    }
    draw(inCursor, inArrowEnd)
}

canvas.onmousedown = function (e) {
    if (posInCursor == null && inCursor) {
        posInCursor = { x: e.clientX - cursor.x - offset.left, y: e.clientY - cursor.y - offset.top }
        initialPos = {x:e.clientX - offset.left, y: e.clientY-offset.top}
    }
    if (posInArrowEnd == null && inArrowEnd) {
        posInArrowEnd = { arg: arrowEnd.arg - Math.atan2((e.clientY - cursor.y - offset.top),(e.clientX - cursor.x - offset.left))}
        initialPos = {arg:Math.atan2((e.clientY - cursor.y - offset.top),(e.clientX - cursor.x - offset.left))}
    }
}
canvas.onmouseup = function (e) {
    posInCursor = null
    posInArrowEnd = null
}
canvas.onmouseleave = function () {
    posInCursor = null
    posInArrowEnd = null
    draw()
}
lineNumber_input.onchange=function(e){
    createPoints()
    draw()
}