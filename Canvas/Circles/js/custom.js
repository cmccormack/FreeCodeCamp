var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

function windowResize() {
    canvas.width = window.innerWidth - 4
    canvas.height = window.innerHeight - 4 

    for(let i=0, c; i < circleArray.length; i++){
        c = circleArray[i]
        if(c.x - c.radius < 0){
            c.x = c.radius
        }
        if(c.y - c.radius < 0){
            c.y = c.radius
        }
        if(c.x + c.radius > window.innerWidth){
            c.x = window.innerWidth - c.radius
        }
        if(c.y + c.radius > window.innerHeight){
            c.y = window.innerHeight - c.radius
        }
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
function init (numCircles, minSpeed, maxSpeed, maxRadius) {

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

        radius = Math.floor(Math.random() * maxRadius)
        x = radius + Math.floor(Math.random() * (window.innerWidth - 2 * radius))
        y = radius + Math.floor(Math.random() * (window.innerHeight - 2 * radius))
        dx = (Math.random() -0.5) * 2 * maxSpeed
        dy = (Math.random() -0.5) * 2 * maxSpeed
        // dx = ((1 - (radius/maxRadius)) - 0.5) * 2 
        // dy = ((1 - (radius/maxRadius)) - 0.5) * 2
        color = 'hsla(' + Math.floor(Math.random() * 255) + ',60%,60%,0.9)'

        circle = new Circle(x, y, dx, dy, radius, color)
        circleArray.push(circle)
        circle.draw()
    }

    animate()
}

init(numCircles = 100, minSpeed = 5, maxSpeed=10, radiusRange = 60)
