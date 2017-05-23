window.onload = () => {

    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext('2d')
    windowResize()

}

var windowResize = () => ['Width', 'Height'].map(i=>canvas[i.toLowerCase()]=window['inner'+i])