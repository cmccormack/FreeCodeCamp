/*eslint no-console: "off"*/

import { 
  Col, Row, Grid,
} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

var globals = {
  board: [],
  boardSize: {
    columns: 10,
    rows: 15,
    cells: 0,
    padding: 10
  },
  cellSize: {
    width: 32,
    height: 32
  }
}


class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  componentDidUpdate(){
    console.log(this.state)
  }

  render() {

    return (
      <Grid>

        <Row>
          <Col 
              className='title display-3 text-center text-shadow'
              sm={12} 
          >
            {'Game of Life'}
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <Board />
          </Col>
        </Row>

      </Grid>
    )
  }
}


class Board extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      board: globals.board
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }


  render() {
    const boardDivStyle = {
      width: (globals.boardSize.columns * (globals.cellSize.width-1)+(2*globals.boardSize.padding)) + 'px',
      height: (globals.boardSize.rows * (globals.cellSize.height-1)+(2*globals.boardSize.padding)) + 'px',
      padding: globals.boardSize.padding
    }

    return (
      <div 
          className='board' 
          style={boardDivStyle}
      >
        {this.state.board.map( (cell) => {
          return (
            <Cell 
                class={cell.class}
                handleClick={this.handleCellClick}
                id={cell.id}
                key={cell.key}
            />
          )
        })}
      </div>
    )
  }
}


class Cell extends React.Component {

  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      class: this.props.class
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }


  handleClick(event) {
    var cellpos = event.currentTarget.dataset.pos,
      className = this.state.class.includes('dead') ? 'cell alive' : 'cell dead'
    this.setState({class: className})
    globals.board[cellpos].class = className
    getLiveNeighbors(cellpos)
  }

  render() {
    return (
      <div 
          className={this.state.class}
          data-pos={this.props.id}
          id={this.props.id}
          onClick={this.handleClick}
          style={{width: globals.cellSize.width, height: globals.cellSize.height}}
      />
    )
  }
}


window.onload = function(){

  initializeBoard()

  ReactDOM.render(<App board={globals.board} />, 
    document.getElementById('root')
  )
}


var initializeBoard = () => {

  let row, col, up, down,
    validCol = col => col >= 0 && col < globals.boardSize.columns,
    validRow = row => row >= 0 && row < globals.boardSize.rows

  globals.boardSize.cells = globals.boardSize.columns * globals.boardSize.rows

  function findNeighbors(row, col){
    let neighbors = []
    if ( validRow(row - 1) ) {
      up = i - globals.boardSize.columns
      neighbors.push(up)
      if ( validCol(col - 1) ) neighbors.push(up - 1)
      if ( validCol(col + 1) ) neighbors.push(up + 1)
    }
    if ( validRow(row + 1) ) {
      down = i + globals.boardSize.columns
      neighbors.push(down)
      if ( validCol(col - 1) ) neighbors.push(down - 1)
      if ( validCol(col + 1) ) neighbors.push(down + 1)
    }
    if ( validCol(col - 1) ) neighbors.push(i - 1)
    if ( validCol(col + 1) ) neighbors.push(i + 1)

    return neighbors
  }
  
  for (var i=0; i < globals.boardSize.cells; i++){

    row = Math.floor(i/globals.boardSize.columns)
    col = i % globals.boardSize.columns

    globals.board.push({
      id: i,
      key: i,
      neighbors: findNeighbors(row,col),
      class: Math.random() > 0.7 ? 'cell alive' : 'cell dead'})
  }
  return globals.board
}

var getLiveNeighbors = (cellpos) => {
  return globals.board[cellpos].neighbors.reduce( (acc, pos) => 
    acc + (globals.board[pos].class.includes('alive') ? 1 : 0)
  , 0)


}