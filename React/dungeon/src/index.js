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
  PADDING: 2,
  MAXENEMIES: 25,
  FOGRADIUS: 6,
  level: 1,
  MAXLEVEL: 2,
  player: {
    xpPow: 3.2,
    healthPackMult: 0.6,
    initialStats: {
      hp: 120,
      atk: 35,
      def: 4
    }
  },
  boss: {
    alive: true,
    stats: {
      hp: 500,
      atk: 40,
      def: 6
    }
  },
  style: {
    PADDING: 12,
  },
  tileSize:{
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
    { name: 'ogre',     atk: 20, hp: 150, def:25 },
    { name: 'goblin',   atk: 10, hp: 100, def:12 },
    { name: 'hydra',    atk: 13, hp: 130, def:20 },
    { name: 'ghoul',    atk: 10, hp: 100, def:14 },
    { name: 'griffin',  atk: 17, hp: 120, def:20 },
    { name: 'kobold',   atk: 8,  hp: 80 , def:12 },
    { name: 'skeleton', atk: 10, hp: 100, def:15 },
    { name: 'troll',    atk: 12, hp: 80 , def:25 },
    { name: 'vampire',  atk: 15, hp: 120, def:18 },
    { name: 'zombie',   atk: 11, hp: 140, def:16 }
  ],
  items: [
    {
      name: 'weapon',
      icon: 'ra ra-battered-axe',
      value: ['atk', 3],
      MIN: 3,
      MAX: 5,
      func: 'modify_combat_stat'
    },
    {
      name: 'shield',
      icon: 'ra ra-broken-shield',
      value: ['def', 1],
      MIN: 2,
      MAX: 4,
      func: 'modify_combat_stat'
    },
    {
      name: 'health',
      icon: 'ra ra-health',
      MIN: 4,
      MAX: 7,
      value: 'health_pack',
      func: 'modify_health'
    },
    {
      name: 'exit',
      icon: 'ra ra-hole-ladder',
      MIN: 1,
      MAX: 1,
      value: null,
      func: null
    }
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
      player: {},
      statusText: map.statusText,
      exit_visible: false
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
      item.addEventListener('click', ()=>{
        this.characterMove(ARROW_KEYS[item.id])
      })
    })
  }

  characterMove(pos){
    var player = this.state.player

    player.pos = player.move(pos)
    if (player.pos === 'exit'){
      map.level += 1
      return(this.init())
    }
    if (player.hp <= 0 ){
      writeStatus('Like, game over, man!!')
      map.level = 1
      this.init()
    } else {
      this.update()
    }

    if (!map.boss.alive) {
      writeStatus('The dungeon boss has been defeated!  Player has saved the day once again!')
      player.hp = 0
      map.level = 1
      this.setState({player: player, level: map.level}, this.init)
      map.boss.alive = true
    }
  }

  initializeMap(){
    map.tiles = generateTiles( map.ROWS, map.COLS, { class:'tile stone' } )
    map.rooms = generateRooms()
    generateTunnels()
    generateWalls()
    generateFog()
  }


  initializeCharacters(){
    var player = this.state.player,
      multiplier = 1 + ((map.level-1)/10)

    // Only push new player if player does not exist
    if (Object.keys(this.state.player).length === 0 || this.state.player.hp <= 0){
      writeStatus('Player has started a new journey...')
      map.level = 1
      player = new Mob(map.rooms[0].random_location(), 0, 0, 0, {}, {}, 1, 'player')
      player.hp = map.player.initialStats.hp
      player.maxhp = player.hp
      player.atk = map.player.initialStats.atk
      player.def = map.player.initialStats.def
    } else { 
      // Move player to room 0, maintaining stats, gear and experience
      player.pos = map.rooms[0].random_location()
    }
    player.draw('player floor')
    this.setState({player:player}, this.update)

    return generateEnemiesByMap(multiplier)
  }

  initializeItems(){
    var items = generateItems(),
      pos, tile, boss,
      bstats = map.boss.stats
    if (map.level === map.MAXLEVEL){
      for (let i in items){
        if (items[i].name === 'exit') {
          pos = items[i].pos
          tile = map.tiles[pos.y][pos.x]
          delete tile.item
          boss = new Mob(pos, bstats.hp, bstats.atk, bstats.def, null, null, 10, 'boss', 'ra ra-death-skull')
          boss.draw('boss item floor')
        }
      }
    }

  }

  init(){
    this.initializeMap()
    this.initializeCharacters()
    this.initializeItems()
    this.setState({
      mapTiles: map.tiles.slice(0)
    })
  }

  handleGenerateClick(){
    this.init()
  }

  update(){
    updateFog(this.state.player.pos)
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
      width: ((map.tileSize.width - 1) * map.COLS) + (2 * map.style.PADDING),
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
            <TileComponent
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


function TileComponent(props) {
  var {x, y} = props.pos,
    tile = null,
    icon = null

  if (props.tile.hasOwnProperty('item')){
    icon = <i className={props.tile.item.icon} />
  }
  if (props.tile.hasOwnProperty('mob')){
    if (props.tile.mob.name === 'boss'){
      icon = <i className={props.tile.mob.icon} />
    }
  }

  if (!props.tile.class.includes('fog')){
    tile = <div className={props.tile.class}>{icon}</div>
  }

  return (
    <div
        className={'tilewrapper'}
        data-pos={y+','+x}
        id={(y*map.COLS + x)}
        key={(y+1) * (x+1)}
        style={{
          width: map.tileSize.width,
          height: map.tileSize.height,
          clear: x === map.COLS ? 'both' : 'none',
          
        }}
    >
      {tile}
    </div>
  )
}

function Statusicons(props){
  return (

    <Grid className={'statusicons unselectable'}>
      <Row>
        <Col sm={3} className={'status text-center'}>
          <i className={'ra ra-fw ra-health'} />
          {'HP: '  + props.player.hp + '/' + props.player.maxhp}
        </Col>
        <Col sm={3} className={'status text-center'}>
          <i className={'ra ra-fw ra-sword'}  />
          {'Atk: ' + props.player.atk}
        </Col>
        <Col sm={3} className={'status text-center'}>
          <i className={'ra ra-fw ra-shield'} />
          {'Def: ' + props.player.def}
        </Col>
        <Col sm={3} className={'status text-center'}>
          {`(${props.player.level})`}
          <i className={'ra ra-fw ra-player'} />
          {'EXP: ' + [props.player.xp,props.player.tnl].join('/')}
        </Col>
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

function generateEnemiesByMap(mult){
  console.log('Generating Enemies')
  var enemies = []
  var floorTiles = getTiles('floor')
  var tile, enemy, type
  for (let i = 0; i < map.MAXENEMIES; i+=1){
    type = map.enemies[(Math.floor(Math.random() * map.enemies.length-1))+1]
    tile = floorTiles.splice(randRangeInt(0, floorTiles.length-1), 1)[0]
    enemy = new Mob(tile.pos, buff(type.hp), buff(type.atk), buff(type.def), null, null, 1, type.name)
    if (enemy.hasNeighbors('player', 'enemy', 'wall')){
      i-=1
    } else {
      enemies.push(enemy)
      enemy.draw('enemy floor')
    }
  }
  return enemies

  function buff(val){
    return Math.round(val * mult)
  }
}

function generateItems(){
  console.log('Generating Items')
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
        item.draw('item')
        num_item-=1
      }
    }
  }
  return items
}


function generateFog(){
  getTiles().forEach((row)=>row.forEach((cell)=>{cell.class = toggleClasses(cell.class, 'fog')}))
}

function updateFog({x,y}){
  var visibleTiles = getTiles('visible'),
    radius = map.FOGRADIUS,
    tile

  visibleTiles.map((v)=>{v.class = toggleClasses(v.class, 'visible fog')})

  for (let row=(-radius); row <= radius; row++){
    for (let col=(-radius); col <= radius; col++){
      if (Math.pow(row, 2) + Math.pow(col, 2) <= Math.pow(radius, 2)){
        
        if (validPos(row + y, col + x)){
          tile = map.tiles[row + y][col + x]
          tile.class = toggleClasses(tile.class, 'fog visible')
        }
      }
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
  this.area = this.w * this.h

  this.intercepts = function(other){
    return this.x1 - map.roomvars.PADDING < other.x2 && this.x2 + map.roomvars.PADDING > other.x1 &&
    this.y1 - map.roomvars.PADDING < other.y2 && this.y2 + map.roomvars.PADDING > other.y1
  }


  this.random_location = function(padding=2){
    return new Pos(randRangeInt(this.x1+padding, this.x2-padding), 
      randRangeInt(this.y1 + padding,this.y2 - padding))
  }

  this.h_tunnel = function(other){
    var startx = Math.floor(Math.min(this.center.x, other.center.x)),
      endx = Math.floor(Math.max(this.center.x, other.center.x)),
      y = Math.floor(this.center.y)

    for (var i = startx; i <= endx; i+=1){
      map.tiles[y][i].class = 'tile floor'
      map.tiles[y-1][i].class = 'tile floor'
    }
  }

  this.v_tunnel = function(other){
    var starty = Math.floor(Math.min(this.center.y, other.center.y)),
      endy = Math.floor(Math.max(this.center.y, other.center.y)),
      x = Math.floor(other.center.x)

    for (var i = starty; i <= endy; i+=1){
      map.tiles[i][x].class = 'tile floor'
      map.tiles[i][x+1].class = 'tile floor'
    }
  }

  this.draw = function(tiles){
    var map_tile
    for (var row = this.y1; row < this.y2; row+=1){
      for (var col = this.x1; col < this.x2; col+=1){
        map_tile = tiles[row][col]
        map_tile.room = this
        map_tile.class = toggleClasses('', 'tile floor')
      }
    }
  }

  return this
}


function Mob (startpos, hp, atk, def, wpn, armor, level, name, icon){
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
  this.icon = icon

  this.take_damage = function(mob){
    var dmg = mob.atk - this.def - mob.piercing > 0 ? mob.atk - this.def - mob.piercing : 0,
      strMsg = ''
    
    dmg = randRangeInt(0.5 * dmg, dmg * 1.5)
    strMsg = mob.name + ' attacks ' + sentenceCase(this.name) + '.  ;'
    strMsg += this.name + ' takes ' + dmg + ' damage!'
    // console.log(strMsg)
    writeStatus(strMsg)
    this.hp -= dmg

    // Enemy dies if HP < 0, else attacks player
    if (this.hp <= 0){
      console.log(this.name + ' was killed!')
      writeStatus(this.name + ' was killed!')
      this.draw('floor enemy')
      if (this.name === 'boss'){
        map.boss.alive = false
      }
      delete map.tiles[this.pos.y][this.pos.x].mob
    }
    return this
  }

  this.get_hp = function(){
    return this.hp
  }

  this.attack = function(target){
    target.take_damage(this)
  }

  this.update_xp = function(xp){
    this.xp += xp
    if (this.xp > this.tnl){
      this.xp = this.xp - this.tnl
      this.maxhp = this.maxhp + (this.level * 20)
      this.hp = this.maxhp
      this.def = this.def + 1
      this.atk = this.atk + 2
      this.tnl = Math.floor(this.level * Math.pow(this.level, map.player.xpPow) + this.tnl)
      this.level += 1
    }
  }
  this.modify_health = function(hp){
    var str = ''
    if (hp==='health_pack'){
      str = this.name + ' found a health pack!  ;'
      hp = Math.floor(map.player.healthPackMult * this.maxhp)
    }
    if (this.hp + hp > this.maxhp) {
      hp = this.maxhp - this.hp
    }
    writeStatus(str + this.name + ' was healed by ' + hp + ' points.')
    this.hp += hp
  }
  this.modify_combat_stat = function(args){
    var [stat, val] = args
    this[stat] += val
  }

  this.move = function(pos){
    
    var newpos = new Pos(this.pos.x + pos.x, this.pos.y + pos.y),
      new_map_tile = map.tiles[newpos.y][newpos.x]

    if (new_map_tile.hasOwnProperty('item')){
      if (new_map_tile.item.func){
        this[new_map_tile.item.func](new_map_tile.item.val)
        new_map_tile.class = toggleClasses(new_map_tile.class, 'item')
        delete new_map_tile.item
      } else {
        if (new_map_tile.item.name === 'exit'){
          return 'exit'
        }
      }
    }

    if (new_map_tile.class.includes('floor')){
      this.draw('player floor')
      this.pos = newpos
      this.draw('floor player')
    }
    else if (new_map_tile.class.includes('enemy') || new_map_tile.class.includes('boss')){
      var mobxp = Math.round((new_map_tile.mob.maxhp + new_map_tile.mob.def*2 + new_map_tile.mob.atk*2) / 10)
      this.attack(new_map_tile.mob)
      if (new_map_tile.mob){
        new_map_tile.mob.attack(this)
      } else {
        this.update_xp(mobxp)
      }
    }

    return this.pos
  }

  this.draw = function(classes){
    var map_tile = map.tiles[this.pos.y][this.pos.x]
    map_tile.mob = this
    map_tile.class = toggleClasses(map_tile.class, classes)
  }

  this.hasNeighbors = function(...filterArr){
    return hasNeighbors(this.pos, filterArr)
  }

  return this
}


function Item(pos, name, icon, func, val){
  this.pos = pos
  this.name = name
  this.icon = icon
  this.func = func
  this.val = val

  this.draw = function(classes){
    var map_tile = map.tiles[this.pos.y][this.pos.x]
    map_tile.item = this
    map_tile.class = toggleClasses(map_tile.class, classes)
  }
}

Item.prototype.hasNeighbors = function(...filterArr){
  return hasNeighbors(this.pos, filterArr)
}




// ===========================================================================
//
//                          UTILITY FUNCTIONS
//
// ===========================================================================

function addClasses(current, items){

  if (typeof items === 'string') {
    current = removeClasses(current, items) // Prevents duplicate classes
    return current + ' ' + items
  }
  return current
}

function removeClasses(current, items){
  if (!current) {
    return current
  }
  current = current.split(' ')
  items = items.split(' ')
  for (let i in items){
    current = current.filter((v)=>v!==items[i])
  }
  return current.join(' ').trim()
}

function toggleClasses(current, items){
  current = current || ''
  var itemsArr = items.trim().split(' ')
  for (let i in itemsArr){
    let item = itemsArr[i]
    if (current.includes(item)){
      current = removeClasses(current, item)
    } else {
      current = addClasses(current, item)
    }
  }
  return current
}

function sentenceCase(text){
  // Update this later with a better algorithm
  return text[0].toUpperCase() + text.slice(1)
}

function writeStatus(text){
  text = text.split(';').map((v)=>sentenceCase(v)).join('')
  map.statusText.unshift(text)
}

function randRangeInt(m, n){
  return Math.floor((Math.random() * (n+1-m)) + m)
}



function hasNeighbors(pos, filterArr){
  return filterArr.reduce((a,filter)=>a + getNeighbors(pos, filter).length, 0) > 0
}


function validPos(y,x){
  if(x<0 || x >= map.COLS) return false
  if(y<0 || y >= map.ROWS) return false
  return true
}

function getNeighbors(pos, filter){
  filter = typeof(filter)==='string' ? filter : false
  var m = map.tiles, 
    {x,y} = pos,
    neighbors = []

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

function getTiles(tileType){
  if (typeof tileType === 'string'){
    return [].concat.apply([], map.tiles.map((row)=>row.filter((i)=>i.class.includes(tileType))))
  }
  return map.tiles
}