/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
import { Col, Row, Grid } from 'react-bootstrap'

var map = {
  rooms: [],
  tiles: [],
  statusText: [],
  characters: [],
  COLS: 70,
  ROWS: 40,
  PADDING: 1,
  MAXENEMIES: 25,
  player: {
    xpPow: 3.2,
    healthPackMult: 0.6
  },
  style: {
    PADDING: 12,
  },
  tile:{
    width: 10,
    height: 10
  },
  roomvars: {
    MAXTRIES: 1000,
    MAXROOMS: 12,
    MIN: 6,
    MAX: 15,
    PADDING: 4,
    MINENEMIES: 1,
    MAXENEMIES: 6
  },
  enemies: [
    { name: 'ogre',     atk: 20, hp: 150, def:30 },
    { name: 'goblin',   atk: 10, hp: 100, def:10 },
    { name: 'hydra',    atk: 13, hp: 130, def:20 },
    { name: 'ghoul',    atk: 10, hp: 100, def:10 },
    { name: 'griffin',  atk: 17, hp: 120, def:20 },
    { name: 'kobold',   atk: 8,  hp: 80 , def:10 },
    { name: 'skeleton', atk: 10, hp: 100, def:10 },
    { name: 'troll',    atk: 12, hp: 80 , def:30 },
    { name: 'vampire',  atk: 15, hp: 120, def:10 },
    { name: 'zombie',   atk: 11, hp: 140, def:10 }
  ],
  items: [
    {
      name: 'weapon',
      icon: 'ra ra-battered-axe',
      value: ['atk', 3],
      MIN: 2,
      MAX: 5,
      func: 'modify_combat_stat'
    },
    {
      name: 'shield',
      icon: 'ra ra-broken-shield',
      value: ['def', 2],
      MIN: 2,
      MAX: 5,
      func: 'modify_combat_stat'
    },
    {
      name: 'health',
      icon: 'ra ra-health',
      MIN: 4,
      MAX: 7,
      value: 'health_pack',
      func: 'modify_health'
    }
  ]
}

// ra-hole-ladder for later 

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
      player: {},
      statusText: map.statusText
    }
  }

  componentWillMount(){
    this.init()
  }

  componentDidMount(){
    this.initializeHandlers()
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
    var player = this.state.player

    player.pos = player.move(pos)
    if (player.hp <= 0 ){
      writeStatus(player.name + ' has died!  Like, game over, man!!')
      this.init()
    } else {
      this.update()
    }
  }

  initializeMap(){
    map.tiles = generateTiles(
      map.ROWS, map.COLS, { class:'tile stone' })

    map.rooms = generateRooms()
    generateTunnels()
    generateWalls()
    generateFog()
  }


  initializeCharacters(){
    var player = this.state.player,
      enemies = []

    // Only push new player if player does not exist
    if (Object.keys(this.state.player).length === 0 || this.state.player.hp <= 0){
      player = new Mob(map.rooms[0].random_location(), 120, 40, 6, {}, {}, 1, 'player')
    } else { // Move player to room 0, maintaining stats, gear and experience
      player.pos = map.rooms[0].random_location()
    }
    player.draw('player')

    enemies = generateEnemiesByMap()
    enemies.forEach((e)=>{e.draw('enemy')}) 
    map.enemies = [player].concat(enemies)
  }

  initializeItems(){
    generateItems()
  }


  init(){
    this.initializeMap()
    this.initializeCharacters()
    this.initializeItems()
    this.setState({player: map.enemies[0], mapTiles: map.tiles.slice(0)})
  }

  handleGenerateClick(){
    this.init()
  }

  update(){
    this.setState({ 
      mapTiles: map.tiles.slice(0),
      statusText: map.statusText
    })
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
            statusText={this.state.statusText}
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
        <div className={'statusText'}>
          <ul>
            { this.props.statusText.map((v,i)=><li key={''+i+v}>{v}</li>)}
          </ul>
        </div>
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
    > {(props.tile.hasOwnProperty('item')) && (<i className={props.tile.item.icon} />)}
    </div>
  )
}

function Statusicons(props){
  return (

    <Grid className={'statusicons unselectable'}>
      <Row>
        <Col sm={3} className={'status text-center'}><i className={'ra ra-fw ra-health'} />{'HP: '  + props.player.hp.toFixed(1)}</Col>
        <Col sm={3} className={'status text-center'}><i className={'ra ra-fw ra-sword'}  />{'Atk: ' + props.player.atk}</Col>
        <Col sm={3} className={'status text-center'}><i className={'ra ra-fw ra-shield'} />{'Def: ' + props.player.def}</Col>
        <Col sm={3} className={'status text-center'}><i className={'ra ra-fw ra-player'} />{'EXP: ' + [props.player.xp,props.player.tnl].join('/')}</Col>
      </Row>
    </Grid>
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




function sentenceCase(text){
  return text[0].toUpperCase() + text.slice(1)
}

function writeStatus(text){
  text = text.split('.  ').map((v)=>sentenceCase(v)).join('.  ')
  map.statusText.unshift(text)
}

function randRangeInt(m, n){
  return Math.floor((Math.random() * (n+1-m)) + m)
}

function getNeighbors(pos, filter){
  filter = typeof(filter)==='string' ? filter : false
  var m = map.tiles, 
    {x,y} = pos,
    neighbors = []

  function validPos(y,x){
    if(x<0 || x >= map.COLS) return false
    if(y<0 || y >= map.ROWS) return false
    return true
  }

  if (validPos(y-1, x+0)){ neighbors.push(m[y-1][x+0]) } 
  if (validPos(y-1, x-1)){ neighbors.push(m[y-1][x-1]) }
  if (validPos(y+1, x+0)){ neighbors.push(m[y+1][x+0]) }
  if (validPos(y+0, x-1)){ neighbors.push(m[y+0][x-1]) }
  if (validPos(y+1, x-1)){ neighbors.push(m[y+1][x-1]) }   
  if (validPos(y-1, x+1)){ neighbors.push(m[y-1][x+1]) }
  if (validPos(y+0, x+1)){ neighbors.push(m[y+0][x+1]) }
  if (validPos(y+1, x+1)){ neighbors.push(m[y+1][x+1]) }

  return filter ? neighbors.filter((i)=>i.class.includes(filter)) : neighbors
}

function hasNeighbors(pos, filterArr){
  return filterArr.reduce((a,filter)=>a + getNeighbors(pos, filter).length, 0) > 0
}

function generateTiles(rows, cols, initObj={}){
  console.log('Generating Tiles')
  var tiles = [],
    className = initObj.class || ''

  for (var row = 0; row < rows; row+=1){
    tiles.push([])
    for (var col = 0; col < cols; col+=1){
      tiles[row].push({
        class: className,
        id: map.COLS*row + col,
        pos: new Pos(col,row)})
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
    w = randRangeInt(map.roomvars.MIN, map.roomvars.MAX)
    h = randRangeInt(map.roomvars.MIN, map.roomvars.MAX)
    x = randRangeInt(map.PADDING, map.COLS - w - map.PADDING)
    y = randRangeInt(map.PADDING, map.ROWS - h - map.PADDING)
    current_room = new Room(x, y, w, h)
    if (!hasIntercepts(current_room)){
      rooms.push(current_room)
      current_room.draw(map.tiles)
    }
    count-=1
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

function getTiles(tileType){
  if (typeof tileType === 'string'){
    return [].concat.apply([], map.tiles.map((row)=>row.filter((i)=>i.class.includes(tileType))))
  }
  return map.tiles
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
  var m = map.tiles
  for(var y=map.PADDING-1; y < (m.length-map.PADDING); y+=1){
    for(var x=map.PADDING-1; x < (m[y].length-map.PADDING); x+=1){
      // Create wall if stone and at least one neighbor is 'floor'
      if( m[y][x].class.includes('stone') ){
        if ( getNeighbors(new Pos(x,y), 'floor').length > 0 ) {
          m[y][x].class = 'tile wall'
        } 
      }
    }  
  }
}


function generateEnemiesByRoom(){
  console.log('Generating Enemies')
  var enemies = [], _, enemy, enemy_count, try_count,
    min = map.roomvars.MINENEMIES,
    max = map.roomvars.MAXENEMIES

  for (let i=1; i<map.rooms.length; i+=1){
    enemy_count = randRangeInt(min,max)
    for (let e = 0; e < enemy_count; e+=1){
      _ = map.enemies[Math.floor(Math.random() * map.enemies.length)]

      // Add enemies while ensuring no enemies are within a neighboring tile
      try_count = 100, enemy = null
      
      while(!enemy || try_count > 0 && getNeighbors(enemy.pos, 'enemy').length > 0){
        enemy = new Mob(map.rooms[i].random_location(), _.hp, _.atk, _.def, null, null, 1, _.name)
        try_count-=1
      }
      enemy.draw('enemy')
      enemies.push(enemy)
    }
  }
  return enemies
}


function generateEnemiesByMap(){
  var enemies = []
  var floorTiles = getTiles('floor')
  var tile, enemy, type
  for (let i = 0; i < map.MAXENEMIES; i+=1){
    type = map.enemies[Math.floor(Math.random() * map.enemies.length)]
    tile = floorTiles.splice(randRangeInt(0, floorTiles.length-1), 1)[0]
    enemy = new Mob(tile.pos, type.hp, type.atk, type.def, null, null, 1, type.name)
    if (enemy.hasNeighbors('player', 'enemy', 'wall')){
      i-=1
    } else {
      enemies.push(enemy)
      enemy.draw('enemy')
    }
  }
  return enemies

}

function generateItems(){
  var tiles = getTiles('floor'), 
    items = [],
    tile, item, num_item

  for (let i in map.items){
    num_item = randRangeInt(map.items[i].MIN, map.items[i].MAX)
    while(num_item > 0 && tiles.length > 0){
      tile = tiles.splice(randRangeInt(0, tiles.length - 1), 1)[0]
      item = new Item(tile.pos, map.items[i].name, map.items[i].icon, map.items[i].func, map.items[i].value)
      if (!item.hasNeighbors('enemy', 'player', 'wall', 'item')){
        items.push(item)
        item.draw('floor item')
        num_item-=1
      }
    }
  }
  return items
}


function generateFog(){
  // Complete later
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
  this.area = this.w * this.h

  return this
}

Room.prototype.draw = function(map){
  for (var row = this.y1; row < this.y2; row+=1){
    for (var col = this.x1; col < this.x2; col+=1){
      map[row][col].room = this
      map[row][col].class = 'tile floor'
    }
  }
}

Room.prototype.intercepts = function(other){
  return this.x1 - map.roomvars.PADDING < other.x2 && this.x2 + map.roomvars.PADDING > other.x1 &&
  this.y1 - map.roomvars.PADDING < other.y2 && this.y2 + map.roomvars.PADDING > other.y1
}

Room.prototype.random_location = function(padding=2){
  return new Pos(randRangeInt(this.x1+padding, this.x2-padding), 
    randRangeInt(this.y1 + padding,this.y2 - padding))
}

Room.prototype.h_tunnel = function(other){
  var startx = Math.floor(Math.min(this.center.x, other.center.x)),
    endx = Math.floor(Math.max(this.center.x, other.center.x)),
    y = Math.floor(this.center.y)

  for (var i = startx; i <= endx; i+=1){
    map.tiles[y][i].class = 'tile floor'
    map.tiles[y-1][i].class = 'tile floor'
  }
}

Room.prototype.v_tunnel = function(other){
  var starty = Math.floor(Math.min(this.center.y, other.center.y)),
    endy = Math.floor(Math.max(this.center.y, other.center.y)),
    x = Math.floor(other.center.x)

  for (var i = starty; i <= endy; i+=1){
    map.tiles[i][x].class = 'tile floor'
    map.tiles[i][x+1].class = 'tile floor'
  }
}

function Mob (startpos, hp, atk, def, wpn, armor, level, name){
  this.hp = hp
  this.maxhp = hp
  this.atk = atk
  this.def = def
  this.wpn = wpn
  this.armor = armor
  this.pos = startpos
  this.level = level
  this.name = name
  this.piercing = 0
  this.xp = 0
  this.tnl = 100

  this.take_damage = function(mob){
    var dmg = mob.atk - this.def - mob.piercing > 0 ? mob.atk - this.def - mob.piercing : 0,
      strMsg = ''
    
    dmg = randRangeInt(0.2 * dmg, dmg * 1.8)
    strMsg = mob.name + ' attacks ' + sentenceCase(this.name) + '.  '
    strMsg += this.name + ' takes ' + dmg + ' damage!'
    console.log(strMsg)
    writeStatus(strMsg)
    this.hp -= dmg

    // Enemy dies if HP < 0, else attacks player
    if (this.hp <= 0){
      console.log(this.name + ' was killed!')
      writeStatus(this.name + ' was killed!')
      this.draw('floor')
      delete map.tiles[this.pos.y][this.pos.x].mob
    }
    return this
  }

  this.attack = function(target){
    target.take_damage(this)
  }

  this.get_hp = function(){
    return this.hp
  }

  this.update_xp = function(xp){
    this.xp += xp
    if (this.xp > this.tnl){
      this.xp = this.xp - this.tnl
      this.maxhp = this.maxhp + (this.level * 20)
      this.hp = this.maxhp
      this.def = this.def + (this.level * 2)
      this.atk = this.atk + (this.level * 4)
      this.tnl = Math.floor(this.level * Math.pow(this.level, map.player.xpPow) + this.tnl)
    }
  }
  return this
}

Mob.prototype.modify_health = function(hp){
  hp = (hp==='health_pack') ? Math.floor(map.player.healthPackMult * this.maxhp) : hp
  this.hp = this.hp + hp > this.maxhp ? this.maxhp : this.hp + hp
}

Mob.prototype.modify_combat_stat = function(args){
  var [stat, val] = args
  this[stat] += val
}

Mob.prototype.move = function(pos){
  var newpos = new Pos(this.pos.x + pos.x, this.pos.y + pos.y),
    map_tile = map.tiles[newpos.y][newpos.x]

  if (map_tile.hasOwnProperty('item')){
    this[map_tile.item.func](map_tile.item.val)
    delete map_tile.item
  }

  if (map_tile.class.includes('floor')){
    this.draw('floor')
    this.pos = new Pos(newpos.x, newpos.y)
    this.draw('player')
    return newpos
  }

  if (map_tile.class.includes('enemy')){
    var mobxp = Math.floor((map_tile.mob.maxhp + map_tile.mob.def + map_tile.mob.atk) / 10)
    this.attack(map_tile.mob)
    if (map_tile.mob){
      map_tile.mob.attack(this)
    } else {
      this.update_xp(mobxp)
    }
  }

  return this.pos
}

Mob.prototype.draw = function(type){
  var map_tile = map.tiles[this.pos.y][this.pos.x]
  map_tile.mob = this
  map_tile.class = 'tile ' + (type || '')
}

Mob.prototype.hasNeighbors = function(...filterArr){
  return hasNeighbors(this.pos, filterArr)
}


function Item(pos, name, icon, func, val){
  this.pos = pos
  this.name = name
  this.icon = icon
  this.func = func
  this.val = val
}

Item.prototype.hasNeighbors = function(...filterArr){
  return hasNeighbors(this.pos, filterArr)
}

Item.prototype.draw = function(type){
  var map_tile = map.tiles[this.pos.y][this.pos.x]
  map_tile.item = this
  map_tile.class = 'tile ' + (type || '')
}