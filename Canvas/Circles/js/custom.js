// arc(x, y, radius, startAngle, endAngle, anticlockwise)

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

function windowResize() {
    canvas.width = window.innerWidth - 4
    canvas.height = window.innerHeight - 4 

    for(let i=0; i < circleArray.length; i++){
        console.log(circleArray[i])
    }
} 


function Circle(x, y, dx, dy, radius, color) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.color = color

    this.update = function() {

        if (this.x + this.radius >= innerWidth || this.x - this.radius <= 0) {
            dx = -dx
        } 
        
        if (this.y + this.radius >= innerHeight || this.y - this.radius <= 0) {
            dy = -dy
        }
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

        radius = Math.floor(Math.random() * radiusRange)
        x = radius + Math.floor(Math.random() * (window.innerWidth - 2 * radius))
        y = radius + Math.floor(Math.random() * (window.innerHeight - 2 * radius))
        dx = (Math.random() -0.5) * speedRange * 2
        dy = (Math.random() -0.5) * speedRange * 2
        color = 'hsla(' + Math.floor(Math.random() * 255) + ',60%,60%,0.9)'

        circle = new Circle(x, y, dx, dy, radius, color)
        circleArray.push(circle)
        circle.draw()
    }

    animate()
}

init(numCircles = 50, speedRange = 10, radiusRange = 60)