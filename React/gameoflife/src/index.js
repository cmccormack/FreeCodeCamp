/*eslint no-console: "off"*/

import { 
  Col, Row, Grid, Button
} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

var globals = {
  board: [],
  boardSize: {
    columns: 50,
    rows: 50,
    cells: 0,
    padding: 10
  },
  cellSize: {
    width: 20,
    height: 20
  }
}


window.onload = function(){

 

  ReactDOM.render(<App board={globals.board} />, document.getElementById('root'))
}


class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {
    }
  }



  componentWillMount(){
    initializeBoard()
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
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleCellClick = this.handleCellClick.bind(this)
    this.handleClearClick = this.handleClearClick.bind(this)
    this.handleRandomClick = this.handleRandomClick.bind(this)
    this.run = this.run.bind(this)
    this.stop = this.stop.bind(this)
    this.state = {
      interval: 0,
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
    this.stop()
    for (let cell in globals.board) globals.board[cell].alive = false
    this.setState({board: globals.board.slice(0)})
  }

  handleRandomClick(){
    this.stop()
    globals.board = randomizedBoard(globals.board)
    this.setState({board: updateBoard()})
  }

  handleUpdate(){
    this.setState({board: updateBoard()})
  }

  run() {
    this.stop()
    this.setState({
      interval: setInterval(this.handleUpdate, 50)
    })
  }

  stop() {
    clearInterval(this.state.interval)
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
        <Cells 
            board={this.state.board}
            handleClick={this.handleCellClick}
        />

        <Button onClick={this.handleUpdate}>{'Step Forward'}</Button>
        <Button onClick={()=> displayBoard(this.state.board)}>{'Display Board'}</Button>
        <Button onClick={()=> displayBoard(globals.board)}>{'Display Global Board'}</Button>
        <Button onClick={this.handleClearClick}>{'Clear Board'}</Button>
        <Button onClick={this.handleRandomClick}>{'Randomize Board'}</Button>
        <Button onClick={this.run}>{'Run'}</Button>
        <Button onClick={this.stop}>{'Stop'}</Button>
      </div>
    )
  }
}


class Cells extends React.Component {

  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {

    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleClick(event) {
    var cell = globals.board[event.currentTarget.id]
    cell.alive = !cell.alive
    this.props.handleClick()
  }

  render() {
    return (
      <div>
        {this.props.board.map( (cell, i) => {
          return (
            <div 
                className={cell.alive ? 'cell alive' : 'cell dead'}
                id={i}
                key={i}
                onClick={this.handleClick}
            />
          )
        })}
      </div>


    )
  }


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
      alive: false
    })
  }
  return randomizedBoard(globals.board)
}

var randomizedBoard = (board) => {
  for (let cell in board) board[cell].alive = (Math.random() > 0.7 ? true : false)
  return board
}

var getLiveNeighbors = (cellpos) => 
  globals.board[cellpos].neighbors.reduce( (acc, pos) => 
    acc + (globals.board[pos].alive ? 1 : 0), 0)


var updateBoard = () => {

  var liveNeighbors, 
    newBoard = []

  for (let cell in globals.board){
    liveNeighbors = getLiveNeighbors(cell)
    newBoard[cell] = {id: Number(cell), neighbors: globals.board[cell].neighbors, alive: false}
    if (globals.board[cell].alive){
      newBoard[cell].alive = ((liveNeighbors === 2 || liveNeighbors === 3) ? true : false)
    } else {
      newBoard[cell].alive = (liveNeighbors === 3 ? true : false)
    }
  }
  globals.board = newBoard
  return globals.board
}

var displayBoard = (board) => {
  let str = ''
  for (let cell = 0; cell < globals.boardSize.cells; cell++){
    str += board[cell].alive ? '1' : '0'
    str += (cell+1) % globals.boardSize.columns === 0 ? '\n' : ' '
  }

  console.log(str)
}