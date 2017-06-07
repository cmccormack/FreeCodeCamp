/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'

var map = {
  tiles: [],
  cols: 100,
  rows: 80,
  padding: 12,
  tile:{
    width: 8,
    height: 8
  },
  rooms: {
    MAXROOMS:10,
    MIN: 15,
    MAX: 30
  }
}


window.onload = function(){
  ReactDOM.render(<App />, document.getElementById('root'))
}

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      mapTiles: []
    }
  }

  componentWillMount(){
    map.tiles = initializeTiles(map.rows, map.cols, 
      {
        class:'tile wall hidden'
      }
    )

    var rooms = generateRooms()
    for (var item in rooms){
      rooms[item].draw(map.tiles)
    }
    

    this.setState({
      mapTiles: map.tiles
    })
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {

    return (
      <div>
        <div className='title display-2 text-center text-shadow unselectable'>
          {'Dungeon Roguelike'}
        </div>
        <Map
            mapTiles={this.state.mapTiles}
        />
      </div>
    )
  }
}


class Map extends React.Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {

    var mapContainerStyle = {
      width: ((map.tile.width - 1) * map.cols) + (2 * map.padding),
      height: ((map.tile.height - 1) * map.rows) + (2 * map.padding),
      padding: map.padding
    }

    return (
      <div 
          className={'mapContainer'} 
          style={mapContainerStyle}
      >
        {this.props.mapTiles.map((row,y)=>
          row.map((tile,x) => (
            <Tile tile={tile} pos={{x:x, y:y}} />
          ))
        )}
      </div>
    )
  }
}


function Tile(props) {
  
  var {x, y} = props.pos

  return (
    <div
        className={props.tile.class}
        id={(y*map.cols + x)}
        key={(y+1) * (x+1)}
        style={{
          width: map.tile.width,
          height: map.tile.height,
          clear: x === map.cols ? 'both' : 'none'
        }}
    />
  )
}


function initializeTiles(rows, cols, initObj={}){
  var tiles = [],
    className = initObj.class || ''

  for (var row = 0; row < rows; row++){
    tiles.push([])
    for (var col = 0; col < cols; col++){
      tiles[row].push({class: className})
    }
  }
  return tiles
}

function randRange(m, n){
  [m,n] = [m,n].sort((a,b)=>a-b)
  return Math.floor((Math.random() * (n-m)) + m)
}

function generateRooms(){
  var rooms = [], current_room, w, h, x, y
  for (let i=0, cap=1000; i < map.rooms.MAXROOMS; i++, cap--){
    w = randRange(map.rooms.MIN, map.rooms.MAX)
    h = randRange(map.rooms.MIN, map.rooms.MAX)
    x = randRange(1, map.cols - w - 2)
    y = randRange(1, map.rows - h - 1)
    current_room = new Room(x, y, w, h)
    if (!hasIntercepts(current_room)){
      rooms.push(current_room)
    }
  }

  function hasIntercepts(newRoom){
    for (let room in rooms){
      if (rooms[room].intercept(newRoom)){
        return true
      }
    }
    return false
  }

  return rooms
}


function Pos(x, y) {
  this.x = x || 0
  this.y = y || 0
  return this
}

function Room(x, y, w, h) {
  this.x1 = x
  this.x2 = x + w - 1
  this.y1 = y
  this.y2 = y + h - 1
  this.w = w
  this.h = h
  this.center = new Pos(
    this.x + (this.w / 2),
    this.y + (this.h / 2)
  )

  return this
}

Room.prototype.draw = function(map){
  for (var row = this.y; row < (this.h + this.y); row++){
    for (var col = this.x; col < this.w + this.x; col++){
      map[row][col].class = 'tile floor'
    }
  }
}

Room.prototype.intercept = function(other){
  return this.x1 < other.x2 && this.x2 > other.x1 &&
  this.y1 < other.y2 && this.y2 > other.y1
}
