/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'

var map = {
  rooms: [],
  TILES: [],
  COLS: 70,
  ROWS: 40,
  PADDING: 2,
  style: {
    PADDING: 12,
  },
  tile:{
    width: 12,
    height: 12
  },
  roomvars: {
    MAXTRIES: 1000,
    MAXROOMS: 12,
    MIN: 6,
    MAX: 15,
    PADDING: 4,
    MINENEMIES: 1,
    MAXENEMIES: 3
  },
  enemies: [
    { name: 'ogre',     atk: 2.0, hp: 15, def:3 },
    { name: 'goblin',   atk: 1.0, hp: 10, def:1 },
    { name: 'hydra',    atk: 1.3, hp: 13, def:2 },
    { name: 'ghoul',    atk: 1.0, hp: 10, def:1 },
    { name: 'griffin',  atk: 1.7, hp: 12, def:2 },
    { name: 'kobold',   atk: 0.8, hp: 8 , def:1 },
    { name: 'skeleton', atk: 1.0, hp: 10, def:1 },
    { name: 'troll',    atk: 1.2, hp: 8 , def:3 },
    { name: 'vampire',  atk: 1.5, hp: 12, def:1 },
    { name: 'zombie',   atk: 1.1, hp: 14, def:1 }
  ]
}

const ARROW_KEYS = {
  'ArrowUp': new Pos(0,-1),
  'ArrowRight': new Pos(1,0),
  'ArrowDown': new Pos(0,1),
  'ArrowLeft': new Pos(-1,0)
}


window.onload = function(){
  ReactDOM.render(<App />, document.getElementById('root'))
}

class App extends React.Component {

  constructor(props){
    super(props)
    this.funcs = {
      handleGenerateClick: this.handleGenerateClick = this.handleGenerateClick.bind(this)
    }

    this.initializeHandlers = this.initializeHandlers.bind(this)

    this.state = { 
      mapTiles: [], 
      player: {} }
  }

  componentWillMount(){
    this.init()
  }

  componentDidMount(){
    this.initializeHandlers()
    console.log('Pos: ' + new Pos(1,2) === new Pos(3,4))
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  initializeHandlers(){
    window.addEventListener('keydown', (e)=> {
      e.preventDefault()
      this.characterMove(ARROW_KEYS[e.code])
    })

    Array.from(document.getElementsByClassName('key')).forEach((item)=>{
      item.addEventListener('click', (e)=>{
        this.characterMove(ARROW_KEYS[item.id])
      })
    })
  }

  characterMove(pos){
    var player = this.state.player,
      newpos = new Pos(player.pos.x + pos.x, player.pos.y + pos.y)
    // if (map.TILES[newpos.y][newpos.x].class.includes('floor')){
    
    player.pos = player.move(pos)
    this.update()
  }

  initializeMap(){
    map.TILES = generateTiles(
      map.ROWS, map.COLS, { class:'tile stone' })

    map.rooms = generateRooms()
    generateTunnels()
    generateWalls()
    generateFog()
  }


  initializeCharacters(){
    var characters = [], testcharacters=[]
    characters.push(new Mob(map.rooms[0].random_location(), 10, 2, 2, {}, {}, 1, 'player'))

    var enemies = generateEnemies()
    console.log(enemies)

    return characters
  }


  init(){
    var rooms = this.initializeMap(),
      characters = this.initializeCharacters(rooms),
      player = characters[0]

    player.draw('player')
    this.setState({player: player, mapTiles: map.TILES.slice(0)})
  }

  handleGenerateClick(){
    this.init()
  }

  update(){
    this.setState({ mapTiles: map.TILES.slice(0) })
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
            player={this.state.player}
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
      width: ((map.tile.width - 1) * map.COLS) + (2 * map.style.PADDING),
      height: '100%',
      padding: map.style.PADDING,
      player: this.props.player
    }

    return (
      <div 
          className={'mapContainer'} 
          style={mapContainerStyle}
      >
        <Statusicons player={this.props.player} />
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
        data-pos={y+','+x}
        id={(y*map.COLS + x)}
        key={(y+1) * (x+1)}
        style={{
          width: map.tile.width,
          height: map.tile.height,
          clear: x === map.COLS ? 'both' : 'none'
        }}
    />
  )
}

function Statusicons(props){
  return (
    <div className={'statusicons unselectable'}>
      <span className={'status'}><i className={'ra ra-fw ra-health'} />{'HP: '  + props.player.hp}</span>
      <span className={'status'}><i className={'ra ra-fw ra-sword'}  />{'Atk: ' + props.player.atk}</span>
      <span className={'status'}><i className={'ra ra-fw ra-shield'} />{'Def: ' + props.player.def}</span>
      <span className={'status'}><i className={'ra ra-fw ra-player'} />{'EXP: ' + [props.player.exp,props.player.tnl].join('/')}</span>
    </div>
  )
}

function Buttons(props) {

  return (
    <div className='buttons btn-group unselectable'>
      <button 
          className='btn btn-outline-secondary'
          onClick={props.funcs.handleGenerateClick}
          type='button'
      >{'Generate New Dungeon'}</button>
      <div className="keys">
        <div className="key" id="ArrowLeft"><span><i className={'fa fa-arrow-left'} /></span></div>
        <div className="key" id="ArrowDown"><span><i className={'fa fa-arrow-down'} /></span></div>
        <div className="key" id="ArrowUp"><span><i className={'fa fa-arrow-up'} /></span></div>
        <div className="key" id="ArrowRight"><span><i className={'fa fa-arrow-right'} /></span></div>
      </div>
    </div>
  )
}


function randRange(m, n){
  [m,n] = [m,n].sort((a,b)=>a-b)
  return Math.floor((Math.random() * (n+1-m)) + m)
}

function generateTiles(rows, cols, initObj={}){
  console.log('Generating Tiles')
  var tiles = [],
    className = initObj.class || ''

  for (var row = 0; row < rows; row++){
    tiles.push([])
    for (var col = 0; col < cols; col++){
      tiles[row].push({class: className, id: map.COLS*row + col})
    }
  }
  return tiles
}

function generateRooms(){
  console.log('Generating Rooms')
  var rooms = [],
    count=map.roomvars.MAXTRIES,
    current_room,
    w, h, x, y
  while (count > 0 && rooms.length < map.roomvars.MAXROOMS){
    w = randRange(map.roomvars.MIN, map.roomvars.MAX)
    h = randRange(map.roomvars.MIN, map.roomvars.MAX)
    x = randRange(map.PADDING, map.COLS - w - map.PADDING)
    y = randRange(map.PADDING, map.ROWS - h - map.PADDING)
    current_room = new Room(x, y, w, h)
    if (!hasIntercepts(current_room)){
      rooms.push(current_room)
      current_room.draw(map.TILES)
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

function generateTunnels(){
  console.log('Generating Tunnels')
  for (var i in map.rooms){
    
    if (i > 0){
      map.rooms[i].h_tunnel(map.rooms[i - 1])
      map.rooms[i].v_tunnel(map.rooms[i - 1])
    }
  }
}

function generateWalls(){
  console.log('Generating Walls')
  var m = map.TILES
  for(var y=1; y < (m.length-1); y++){
    for(var x=1; x < (m[y].length-1); x++){
      
      if( m[y][x].class.includes('stone') ){
        if (
          m[y-1][x-1].class.includes('floor') || 
          m[y-1][x+0].class.includes('floor') || 
          m[y-1][x+1].class.includes('floor') || 
          m[y+0][x-1].class.includes('floor') || 
          m[y+0][x+1].class.includes('floor') || 
          m[y+1][x-1].class.includes('floor') || 
          m[y+1][x+0].class.includes('floor') || 
          m[y+1][x+1].class.includes('floor')
        ) {
          m[y][x].class = 'tile wall'
        } 
      }
        
    }  
  }
  // console.log(JSON.stringify(map.tiles.slice(0)))

}

function generateFog(){

}



function generateEnemies(){
  console.log('Generating Enemies')
  var enemies = [], enemy, enemy_count,
    min = map.roomvars.MINENEMIES,
    max = map.roomvars.MAXENEMIES

  for (let i=1; i<map.rooms.length; i++){
    enemy_count = randRange(min,max)
    for (let e = 0; e < enemy_count; e++){
      enemy = map.enemies[Math.floor(Math.random() * map.enemies.length)]
      enemy = new Mob(map.rooms[i].random_location(), enemy.hp, enemy.atk, enemy.def, null, null, 1, enemy.name)
      enemy.draw('enemy')
      enemies.push(enemy)
      
    }
  }
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
  return this.x1 - map.roomvars.PADDING < other.x2 && this.x2 + map.roomvars.PADDING > other.x1 &&
  this.y1 - map.roomvars.PADDING < other.y2 && this.y2 + map.roomvars.PADDING > other.y1
}

Room.prototype.random_location = function(padding=2){
  return new Pos(randRange(this.x1+padding, this.x2-padding), 
    randRange(this.y1 + padding,this.y2 - padding))
}

Room.prototype.h_tunnel = function(other){
  var startx = Math.floor(Math.min(this.center.x, other.center.x)),
    endx = Math.floor(Math.max(this.center.x, other.center.x)),
    y = Math.floor(this.center.y)

  for (var i = startx; i <= endx; i++){
    map.TILES[y][i].class = 'tile floor'
    map.TILES[y-1][i].class = 'tile floor'
  }
}

Room.prototype.v_tunnel = function(other){
  var starty = Math.floor(Math.min(this.center.y, other.center.y)),
    endy = Math.floor(Math.max(this.center.y, other.center.y)),
    x = Math.floor(other.center.x)

  for (var i = starty; i <= endy; i++){
    map.TILES[i][x].class = 'tile floor'
    map.TILES[i][x+1].class = 'tile floor'
  }
}

function Mob (startpos, hp, atk, def, wpn, armor, level, name){
  this.hp = hp
  this.atk = atk
  this.def = def
  this.wpn = wpn
  this.armor = armor
  this.pos = startpos
  this.level = level
  this.name = name
  this.exp = 0
  this.tnl = 10

  this.take_damage = function(dmg, piercing){
    dmg = this.def - piercing > 0 ? this.def - piercing : 0
    this.hp -= dmg
  }

  this.modify_health = function(hp){
    this.hp += hp
  }

  this.get_hp = function(){
    return this.hp
  }
  return this
}

Mob.prototype.move = function move(pos){
  var newpos = new Pos(this.pos.x + pos.x, this.pos.y + pos.y)
  if (map.TILES[newpos.y][newpos.x].class.includes('floor')){
    this.draw('floor')
    this.pos = new Pos(newpos.x, newpos.y)
    this.draw('player')
    return newpos
  }
  return this.pos
}

Mob.prototype.draw = function(type){
  map.TILES[this.pos.y][this.pos.x].class = 'tile ' + (type || '')
}

Mob.prototype.hasNeighbors = function(){
  console.log(this.pos)
  return this.pos.x-1
}