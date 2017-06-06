// import {Grid, Row, Col} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

var map = {
  width: 70,
  height: 50,
  tiles: 0,
  tile:{
    width: 8,
    height: 8
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
    this.setState({mapTiles: initializeBoard()})
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
        // width: (map.tile.width - 1) * map.width
    }

    return (
      <div 
          className={'mapContainer'} 
          style={mapContainerStyle}
      >
        {this.props.mapTiles.map((tile,i)=> (
          <div
              className={tile.class}
              id={tile.id}
              key={tile.id}
              style={{
                width: map.tile.width,
                height: map.tile.height,
                clear: (i > 0) && (i % (map.width)) === 0 ? 'both' : 'none'
              }}
          />
          )
        )}
      </div>
    )
  }
}


var initializeBoard = () => {
  map.tiles = map.width * map.height
  var board = []
  for (var i = 0; i < map.tiles; i++){
    board.push({id: i, class:'tile'})
  }
  console.log(board)
  return board
}
