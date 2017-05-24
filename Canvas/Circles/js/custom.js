// arc(x, y, radius, startAngle, endAngle, anticlockwise)

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

function windowResize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
} 


function Circle(x, y, dx, dy, radius, color) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.color = color

    this.update = function() {

        this.x += dx
        this.y += dy

        this.draw()
        
    }

    this.draw = function() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()

    }

}


function animate() {

    ctx.clearRect(0,0, canvas.width, canvas.height)
    

    for (let i = 0; i < circleArray.length; i++){
        circleArray[i].update()
    }

    window.requestAnimationFrame(animate)
}


var circleArray = []
function init (numCircles, speedRange, radiusRange) {

    console.log('Inside init')

    circleArray = []
    var x,
        y,
        dx,
        dy,
        radius,
        color,
        circle

    for(let i=0; i < numCircles; i++){
        x = Math.floor(Math.random() * innerWidth)
        y = Math.floor(Math.random() * innerHeight)
        dx = Math.random() * speedRange
        dy = Math.random() * speedRange
        radius = Math.floor(Math.random() * radiusRange)
        color = 'hsl(' + Math.floor(Math.random() * 256) + ',60%,60%)'

        circle = new Circle(x, y, dx, dy, radius, color)
        circleArray.push(circle)
        circle.draw()
    }

    animate()
}

init(100, 6, 60)