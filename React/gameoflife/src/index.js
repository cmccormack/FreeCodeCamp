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
  delay: 0.1 * 1000,
  speed: [
    { text: '10x', dataSpeed: 10 },
    { text: '5x', dataSpeed: 5 },
    { text: '3x', dataSpeed: 3 },
    { text: '2x', dataSpeed: 2 },
    { text: '1x', dataSpeed: 1 },
    { text: '1/2x', dataSpeed: 0.5 },
    { text: '1/4x', dataSpeed: 0.25 }
  ]
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
    this.handleSpeedClick = this.handleSpeedClick.bind(this)
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
      isRunning: true,
      delay: globals.delay
    }
  }


  componentWillMount() {
    if (this.state.isRunning) this.run()
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleSpeedClick(speed){
    clearInterval(this.state.interval)
    this.setState({delay: Math.floor(1/speed * globals.delay)}, () => {
      if (this.state.isRunning) this.run()
      console.log(this.state.delay)
    })
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
      interval: setInterval(this.handleUpdate, this.state.delay),
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
        handleSpeedClick: this.handleSpeedClick,
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
      btn: 'btn btn-outline-secondary btn-sm',
      dropBtn:  'btn btn-outline-secondary btn-sm dropdown-toggle'
    },
    handleSpeedClick = (e) => {
      console.log(e.currentTarget.dataset.speed)
      props.funcs.handleSpeedClick(e.currentTarget.dataset.speed)

    }
  

  return (
    <div
        className='btn-group'
        role='group'
    >
      <button 
          className={buttonAttr.btn}
          onClick={props.funcs.handleStepClick}
          type='button'
      >{'Step Forward'}
      </button>
      <button
          className={buttonAttr.btn}
          onClick={props.funcs.handleClearClick}
          type='button'
      >{'Clear Board'}
      </button>
      <button
          className={buttonAttr.btn}
          onClick={props.funcs.handleRandomClick}
          type='button'
      >{'Randomize Board'}
      </button>
      <button
          className={buttonAttr.btn}
          onClick={props.funcs.run}
          type='button'
      >{'Run'}</button>
      <button
          className={buttonAttr.btn}
          onClick={props.funcs.stop}
          type='button'
      >{'Stop'}</button>

      <div 
          className='btn-group dropup'
          role='group'
      >
        <button
            className={buttonAttr.dropBtn}
            data-toggle='dropdown'
            type='button'
        >{'Speed'}</button>
        <div className='dropdown-menu'>
          {globals.speed.map( (speed) => {
            return (
              <a
                  className={'dropdown-item'}
                  data-speed={speed.dataSpeed}
                  key={speed.text}
                  onClick={handleSpeedClick}
              >{speed.text}</a>
            )

          })}
        </div>
      </div>

    </div>
  )
}


var initializeBoard = () => {

  globals.boardSize.cells = globals.boardSize.columns * globals.boardSize.rows

  let row, col, up, down,
    // Functions to find all possible valid neighbors for each cell
    validCol = col => col >= 0 && col < globals.boardSize.columns,
    validRow = row => row >= 0 && row < globals.boardSize.rows,
    findNeighborsBounded = (i, row, col) => {
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
    },
    findNeighbors = (i, row, col) => {
      let neighbors = [], up, down, left, right,
        cells = globals.boardSize.cells,
        cols = globals.boardSize.columns,
        checkLeft = () => ((i - 1) < 0) ? (i + cols - 1) : (i - 0),
        checkRight = () => ((i + 1) >= cols) ? (i - cols + 1) : (i + 1),
        checkUp = () => validRow(row-1) ? (i - cols) : (i - cols + cells),
        checkDown = () => validRow(row+1) ? (i + cols) : (i + cols - cells)

      // if (validRow(row-1)) up = i - cols
      // else up = i + cols - cells
      // neighbors.push(up)
      // if (up + 1 >= cols) neighbors.push(up - cols + 1)
      // else neighbors.push(up + 1)
      // if (up - 1 < 0) neighbors.push(up + cols - 1)

      left = checkLeft()
      right = checkRight()
      up = checkUp()
      down = checkDown()
      neighbors.push(left)
      neighbors.push(right)
      neighbors.push(up)
      neighbors.push(down)
      console.log(neighbors)
      return neighbors

    }
    
  
  for (var i=0; i < globals.boardSize.cells; i++){
    row = Math.floor(i/globals.boardSize.columns)
    col = i % globals.boardSize.columns

    globals.board.push({
      id: i,
      neighbors: findNeighbors(i, row,col),
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



/*

00 01 02 03 04
05 06 07 08 09
10 11 12 13 14
15 16 17 18 19
20 21 22 23 24

00 01 02
03 04 05
06 07 08
09 10 11
12 13 14


*/