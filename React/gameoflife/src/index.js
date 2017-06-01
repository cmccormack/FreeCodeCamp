/*eslint no-console: "off"*/

import { 
  Col, Row, Grid
} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

var globals = {
  board: [],
  boardSize: {
    columns: 70,
    rows: 50,
    cells: 0,
    padding: 10
  },
  cellSize: {
    width: 12,
    height: 12
  },
  delay: 1 * 1000
}


window.onload = function(){
  ReactDOM.render(<App board={globals.board} />, document.getElementById('root'))
}


class App extends React.Component {

  constructor(props){
    super(props)
    this.state = {}
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
      <div>
        <Grid>
          <Row>
            <Col 
                className='title display-3 text-center text-shadow unselectable'
                sm={12} 
            >
              {'Game of Life'}
            </Col>
          </Row>
        </Grid>
        <div>
          <div>
            <Board board={this.props.board} />
          </div>
        </div>
      </div>
    )
  }
}


class Board extends React.Component {

  constructor(props){
    super(props)
    this.handleStepClick = this.handleStepClick.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
    this.handleCellClick = this.handleCellClick.bind(this)
    this.handleClearClick = this.handleClearClick.bind(this)
    this.handleRandomClick = this.handleRandomClick.bind(this)
    this.run = this.run.bind(this)
    this.stop = this.stop.bind(this)
    this.state = {
      interval: 0,
      generation: 0,
      board: this.props.board,
      isRunning: true
    }
  }


  componentWillMount() {
    if (this.state.isRunning) this.run()
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleCellClick(){
    this.setState({board: globals.board.slice(0)})
  }

  handleStepClick(){
    if (!this.state.isRunning) this.handleUpdate()
  }

  handleClearClick(){
    clearInterval(this.state.interval)
    for (let cell in globals.board) globals.board[cell].alive = false
    this.setState({generation: -1}, () => { this.handleUpdate() })
  }

  handleRandomClick(){
    clearInterval(this.state.interval)
    globals.board = randomizedBoard(globals.board)
    this.setState({generation: -1}, () => { 
      this.handleUpdate()
      if (this.state.isRunning) this.run()
    })
    
  }

  handleUpdate(){
    this.setState({board: updateBoard(), generation: this.state.generation + 1})
  }

  run() {
    this.stop()
    this.setState({
      interval: setInterval(this.handleUpdate, globals.delay),
      isRunning: true
    })
  }

  stop() {
    clearInterval(this.state.interval)
    this.setState({isRunning: false})
  }

  render() {
    const boardDivStyle = {
        width: (globals.boardSize.columns * (globals.cellSize.width-1)+(2*globals.boardSize.padding)) + 'px',
        height: '100%',
        padding: globals.boardSize.padding
      },
      btnFuncs = {
        handleClearClick: this.handleClearClick,
        handleStepClick: this.handleStepClick,
        handleRandomClick: this.handleRandomClick,
        run: this.run,
        stop: this.stop
      }
      

    return (
      <div 
          className='board' 
          style={boardDivStyle}
      >
        <div>
          <div className='cells'>
            <Cells 
                board={this.state.board}
                handleClick={this.handleCellClick}
            />
          </div>
        </div>
        <div>
          <div className='buttons'>
            <Buttons funcs={btnFuncs} />
            <div className='generations unselectable'>
              {'Generation: '}{this.state.generation}
            </div>
          </div>
        </div>
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
                key={cell.id}
                onClick={this.handleClick}
                style={{
                  width: globals.cellSize.width,
                  height: globals.cellSize.height
                }}
            />
          )
        })}
      </div>
    )
  }
}


var Buttons = (props) => {
  let buttonAttr = {
    class: 'btn btn-outline-secondary btn-sm'
  }

  return (
    <div
        className='btn-group'
        role='group'
    >
      <button 
          className={buttonAttr.class}
          onClick={props.funcs.handleStepClick}
          type='button'
      >{'Step Forward'}
      </button>
      <button
          className={buttonAttr.class}
          onClick={props.funcs.handleClearClick}
          type='button'
      >{'Clear Board'}
      </button>
      <button
          className={buttonAttr.class}
          onClick={props.funcs.handleRandomClick}
          type='button'
      >{'Randomize Board'}
      </button>
      <button
          className={buttonAttr.class}
          onClick={props.funcs.run}
          type='button'
      >{'Run'}</button>
      <button
          className={buttonAttr.class}
          onClick={props.funcs.stop}
          type='button'
      >{'Stop'}</button>
    </div>
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

