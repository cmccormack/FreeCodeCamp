// import {Grid, Row, Col} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

var globals = {
  map: {
    width: 70,
    height: 50,
    cells: 0
  }
}


window.onload = function(){
  ReactDOM.render(<App map={globals.map} />, document.getElementById('root'))
}

class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  componentWillUpdate(){
    initializeBoard()
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
        <div>
          <Board map={this.props.map} />
        </div>
      </div>
    )
  }
}


class Board extends React.Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {

    var cells = []
    // for (row =0)

    return (
      <div>
        
      </div>
    )
  }
}


var initializeBoard = () => {
  globals.board.cells = globals.board.width * globals.board.height
  var board = []
  for (var cell in globals.board.cells){
    board.push({id: cell})
  }
}
