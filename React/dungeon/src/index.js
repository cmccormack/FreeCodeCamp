/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'

var map = {
    tiles: [],
    cols: 50,
    rows: 40,
    padding: 12,
    tile:{
      width: 12,
      height: 12
    },
    rooms: {
      MAXTRIES: 1000,
      MAXROOMS: 12,
      MIN: 6,
      MAX: 15,
      PADDING: 4
    }
  },
  enemies = [
    { name: 'ogre',      statmod: { atk: 2.0, hp: 1.5 }},
    { name: 'goblin',    statmod: { atk: 1.0, hp: 1.0 }},
    { name: 'hydra',     statmod: { atk: 1.3, hp: 1.3 }},
    { name: 'ghoul',     statmod: { atk: 1.0, hp: 1.0 }},
    { name: 'griffin',   statmod: { atk: 1.7, hp: 1.2 }},
    { name: 'kobold',    statmod: { atk: 0.8, hp: 0.8 }},
    { name: 'skeleton',  statmod: { atk: 1.0, hp: 1.0 }},
    { name: 'troll',     statmod: { atk: 1.2, hp: 0.8 }},
    { name: 'vampire',   statmod: { atk: 1.5, hp: 1.2 }},
    { name: 'zombie',    statmod: { atk: 1.1, hp: 1.4 }}
  ]


window.onload = function(){
  ReactDOM.render(<App />, document.getElementById('root'))
}

class App extends React.Component {

  constructor(props){
    super(props)
    this.funcs = {
      handleGenerateClick: this.handleGenerateClick = this.handleGenerateClick.bind(this)
    }
    this.state = { mapTiles: [] }
  }

  componentWillMount(){
    this.init()
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  initializeMap(){
    map.tiles = generateTiles(
      map.rows, map.cols, { class:'tile wall hidden' })

    var rooms = generateRooms()

    for (var item in rooms){
      rooms[item].draw(map.tiles)
      if (item > 0){
        rooms[item].h_tunnel(rooms[item - 1])
        rooms[item].v_tunnel(rooms[item - 1])
      }
    }
    return rooms
  }

  initializeHandlers(){
    const ARROW_KEYS = {
      'ArrowUp': new Pos(0,-1),
      'ArrowRight': new Pos(1,0),
      'ArrowDown': new Pos(0,1),
      'ArrowLeft': new Pos(-1,0)
    }
    window.addEventListener('keydown', function(e){
      console.log(e.code)
    })
  }

  initializeCharacters(rooms){
    var player = new Mob(rooms[0].random_location())
    player.draw('player')
  }

  init(){
    var rooms = this.initializeMap()
    this.initializeCharacters(rooms)
    this.initializeHandlers()
    this.update()
  }

  handleGenerateClick(){
    this.init()
  }

  update(){
    this.setState({ mapTiles: map.tiles.slice(0) })
  }

  render() {

    return (
      <div>
        <div className='title display-2 text-center text-shadow unselectable'>
          {'Dungeon Roguelike'}
        </div>
        <Map
            funcs={this.funcs}
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
      height: '100%',
      padding: map.padding
    }

    return (
      <div 
          className={'mapContainer'} 
          style={mapContainerStyle}
      >
        {this.props.mapTiles.map((row,y)=>
          row.map((tile,x) => (
            <Tile
                key={tile.id * y + x}
                pos={{x:x, y:y}}
                tile={tile}
            />
          ))
        )}
        <Buttons funcs={this.props.funcs} />
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

function Buttons(props) {

  return (
    <div className='buttons btn-group'>
      <button 
          className='btn btn-outline-secondary'
          onClick={props.funcs.handleGenerateClick}
          type='button'
      >{'Generate New Dungeon'}</button>
    </div>

  )
}


function randRange(m, n){
  [m,n] = [m,n].sort((a,b)=>a-b)
  return Math.floor((Math.random() * (n-m)) + m)
}

function generateTiles(rows, cols, initObj={}){
  var tiles = [],
    className = initObj.class || ''

  for (var row = 0; row < rows; row++){
    tiles.push([])
    for (var col = 0; col < cols; col++){
      tiles[row].push({class: className, id: map.cols*row + col})
    }
  }
  return tiles
}

function generateRooms(){
  var rooms = [], count=map.rooms.MAXTRIES, current_room, w, h, x, y
  while (count > 0 && rooms.length < map.rooms.MAXROOMS){
    w = randRange(map.rooms.MIN, map.rooms.MAX)
    h = randRange(map.rooms.MIN, map.rooms.MAX)
    x = randRange(1, map.cols - w - 1)
    y = randRange(1, map.rows - h - 1)
    current_room = new Room(x, y, w, h)
    if (!hasIntercepts(current_room)){
      rooms.push(current_room)
    }
    count--
  }

  function hasIntercepts(newRoom){
    for (let room in rooms){
      if (rooms[room].intercepts(newRoom)){
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
    (this.x1 + this.x2) / 2, 
    (this.y1 + this.y2) / 2
  )

  return this
}

Room.prototype.draw = function(map){
  for (var row = this.y1; row < this.y2; row++){
    for (var col = this.x1; col < this.x2; col++){
      map[row][col].class = 'tile floor'
    }
  }
}

Room.prototype.intercepts = function(other){
  return this.x1 - map.rooms.PADDING < other.x2 && this.x2 + map.rooms.PADDING > other.x1 &&
  this.y1 - map.rooms.PADDING < other.y2 && this.y2 + map.rooms.PADDING > other.y1
}

Room.prototype.h_tunnel = function(other){
  var startx = Math.floor(Math.min(this.center.x, other.center.x)),
    endx = Math.floor(Math.max(this.center.x, other.center.x)),
    y = Math.floor(this.center.y)

  for (var i = startx; i <= endx; i++){
    map.tiles[y][i].class = 'tile floor'
    map.tiles[y-1][i].class = 'tile floor'
  }
}

Room.prototype.random_location = function(padding=1){
  return new Pos(randRange(this.x1+padding, this.x2-padding), 
    randRange(this.y1 + padding,this.y2 - padding))
}

Room.prototype.v_tunnel = function(other){
  var starty = Math.floor(Math.min(this.center.y, other.center.y)),
    endy = Math.floor(Math.max(this.center.y, other.center.y)),
    x = Math.floor(other.center.x)

  for (var i = starty; i <= endy; i++){
    map.tiles[i][x].class = 'tile floor'
    map.tiles[i][x+1].class = 'tile floor'
  }
}

function Mob (startpos, hp, atk, def, wpn, armor, level, name){
  this.hp = hp
  this.atk = atk
  this.def = def
  this.wpn = wpn
  this.armor = armor
  this.x = startpos.x
  this.y = startpos.y
  this.level = level
  this.name = name

  function take_damage(dmg, piercing){
    dmg = this.def - piercing > 0 ? this.def - piercing : 0
    this.hp -= dmg
  }

  function modify_health(hp){
    this.hp += hp
  }

  function get_hp(){
    return this.hp
  }

  function move(pos, map){
    var newpos = new Pos(this.x + pos.x, this.y + pos.y)
    if (map[newpos.y,newpos.x].class.includes('floor')){
      this.x = newpos.x,
      this.y = newpos.y
      return newpos
    }
      
  }
}

Mob.prototype.draw = function(type){
  map.tiles[this.y][this.x].class = 'tile floor ' + (type || '')
}