/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'

var map = {
  cols: 70,
  rows: 50,
  padding: 12,
  tile:{
    width: 12,
    height: 10
  }
}


window.onload = function(){
  ReactDOM.render(<App map={map} />, document.getElementById('root'))
}

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      mapTiles: []
    }
  }

  componentWillMount(){
    this.setState({
      mapTiles: initializeTiles(map.rows, map.cols, 
        {
          class:'tile hidden'
        }
      )
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

    var rect = new Rect(0, 0, 100, 100)
    console.log(this.props.mapTiles)

    return (
      <div 
          className={'mapContainer'} 
          style={mapContainerStyle}
      >
        {this.props.mapTiles.map((row,y)=>
          row.map( (tile,x) => (
            <Tile tile={tile} pos={{x:x, y:y}} />
          ))
        )}
      </div>
    )
  }
}

var Tile = (props) => {
  
  var {x, y} = props.pos

  return (
    <div
      className={props.tile.class}
      id={(y*map.cols + x)}
      key={(y+1) * (x+1)}
      style={{
        width: map.tile.width,
        height: map.tile.height,
        clear: x > 0 && x % (map.cols-1) === 0 ? 'both' : 'none'
      }}
    />
  )
}


var initializeTiles = function(rows, cols, initObj={}) {
  var tiles = []
  for (var row = 0; row < rows; row++){
    tiles.push([])
    for (var col = 0; col < cols; col++){
      tiles[row].push(initObj)
    }
  }
  return tiles
}


var Pos = function(x, y) {
  this.x = x || 0
  this.y = y || 0
  return this
}

var Rect = function(x, y, w, h) {
  this.x = x || 0
  this.y = y || 0
  this.w = w || window.innerWidth
  this.h = h || window.innerHeight
  this.center = new Pos(
    this.x + (this.w / 2),
    this.y + (this.h / 2)
  )
  this.draw = function(canvas) {

  }
  return this
}
