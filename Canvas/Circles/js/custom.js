// arc(x, y, radius, startAngle, endAngle, anticlockwise)

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
function windowResize() {
    ['Width', 'Height'].map(i=>canvas[i.toLowerCase()]=window['inner'+i])
    init(100, 6, 60)
} 

windowResize()




function Circle(x, y, dx, dy, radius, color) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.color = color

    this.update = () => {


    }

    this.update = () => {

        this.draw()
    }

    this.draw = () => {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = color
        ctx.fill()
    }

}


function init (numCircles, speedRange, radiusRange) {

    var circleArray = [],
        x,
        y,
        dx,
        dy,
        radius,
        color,
        circle

    for(let i=0; i < numCircles; i++){
        x = Math.floor(Math.random() * innerWidth)
        y = Math.floor(Math.random() * innerHeight)
        dx = Math.floor(Math.random() * speedRange)
        dy = Math.floor(Math.random() * speedRange)
        radius = Math.floor(Math.random() * radiusRange)
        color = 'hsl(' + Math.floor(Math.random() * 256) + ',60%,60%)'

        circle = new Circle(x, y, dx, dy, radius, color)
        circleArray.push(circle)
        circle.draw()
    }


}

