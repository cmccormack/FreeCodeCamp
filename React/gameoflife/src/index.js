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
    rows: 10,
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
            <Board board={this.props.board} />
          </Col>
        </Row>

      </Grid>
    )
  }
}


class Board extends React.Component {

  constructor(props){
    super(props)
    this.updateBoard = this.updateBoard.bind(this)
    this.handleCellClick = this.handleCellClick.bind(this)
    this.handleClearClick = this.handleClearClick.bind(this)
    this.state = {
      board: this.props.board
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleCellClick(){
    this.setState({board: globals.board.slice(0)})
  }

  handleClearClick(){
    for (let cell in globals.board) globals.board[cell].alive = false
    this.setState({board: globals.board.slice(0)})
  }

  updateBoard(){
    updateBoard()
    this.setState({board: globals.board.slice(0)})
    displayBoard(this.state.board)
  }

  render() {
    const boardDivStyle = {
      width: (globals.boardSize.columns * (globals.cellSize.width-1)+(2*globals.boardSize.padding)) + 'px',
      height: '100%',
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
                alive={cell.alive}
                handleClick={this.handleCellClick}
                id={cell.id}
                key={cell.id + (cell.alive ? 'alive':'dead')}
            />
          )
        })}
        <p><a style={{color: 'white'}} onClick={this.updateBoard}>{'Update Board'}</a></p>
        <p><a style={{color: 'white'}} onClick={()=> displayBoard(this.state.board)}>{'Display Board'}</a></p>
        <p><a style={{color: 'white'}} onClick={()=> displayBoard(globals.board)}>{'Display Global Board'}</a></p>
        <p><a style={{color: 'white'}} onClick={this.handleClearClick}>{'Clear Board'}</a></p>
      </div>
    )
  }
}


class Cell extends React.Component {

  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      alive: this.props.alive
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }


  handleClick(event) {
    globals.board[event.currentTarget.dataset.pos].alive = !this.state.alive
    this.props.handleClick()
  }

  render() {

    return (
      <div 
          className={this.state.alive ? 'cell alive' : 'cell dead'}
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

  globals.boardSize.cells = globals.boardSize.columns * globals.boardSize.rows

  let row, col, up, down,
    // Functions to find all possible valid neighbors for each cell
    validCol = col => col >= 0 && col < globals.boardSize.columns,
    validRow = row => row >= 0 && row < globals.boardSize.rows,
    findNeighbors = (row, col) => {
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
      neighbors: findNeighbors(row,col),
      alive: Math.random() > 0.7 ? true : false})
  }
  return globals.board
}

var getLiveNeighbors = (cellpos) => 
  globals.board[cellpos].neighbors.reduce( (acc, pos) => 
    acc + (globals.board[pos].alive ? 1 : 0), 0)


var updateBoard = () => {

  var liveNeighbors

  for (let cell in globals.board){
    liveNeighbors = getLiveNeighbors(cell)
    // globals.board[cell].nextState = globals.board[cell].alive
    if (globals.board[cell].alive){
      globals.board[cell].nextState = ((liveNeighbors === 2 || liveNeighbors === 3) ? true : false)
    } else {
      globals.board[cell].nextState = (liveNeighbors === 3 ? true : false)
    }
  }

  for (let cell in globals.board) globals.board[cell].alive = globals.board[cell].nextState
}

var displayBoard = (board) => {
  let str = ''
  for (let cell = 0; cell < globals.boardSize.cells; cell++){
    str += board[cell].alive ? '1' : '0'
    str += (cell+1) % globals.boardSize.columns === 0 ? '\n' : ' '
  }

  console.log(str)
}