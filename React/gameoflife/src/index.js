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
  ],
  seed: 0.3
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
                className={!cell.alive ? 'cell dead' : cell.new ? 'cell alive new' : 'cell alive'}
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

  let row, col,
    // Functions to find all possible valid neighbors for each cell
    findNeighborsToroidal = (i) => {
      let neighbors = [],
        cells = globals.boardSize.cells,
        cols = globals.boardSize.columns,
        checkLeft = (i) => ((i%cols - 1) < 0) ? (i + cols - 1) : (i - 1),
        checkRight = (i) => ((i%cols + 1) >= cols) ? (i - cols + 1) : (i + 1),
        checkUp = (i) => ((i-cols) < 0) ? (i-cols+cells) : (i-cols),
        checkDown = (i) => (i+cols) >= cells ? (i + cols - cells) : (i + cols)

      neighbors.push(checkLeft(i))
      neighbors.push(checkRight(i))
      neighbors.push(checkUp(i))
      neighbors.push(checkDown(i))
      neighbors.push(checkUp(checkLeft(i)))
      neighbors.push(checkUp(checkRight(i)))
      neighbors.push(checkDown(checkLeft(i)))
      neighbors.push(checkDown(checkRight(i)))
      return neighbors

    }
    
  
  for (var i=0; i < globals.boardSize.cells; i++){
    row = Math.floor(i/globals.boardSize.columns)
    col = i % globals.boardSize.columns

    globals.board.push({
      id: i,
      neighbors: findNeighborsToroidal(i, row,col),
      alive: false
    })
  }
  return randomizedBoard(globals.board)
}

var randomizedBoard = (board) => {
  for (let cell in board) board[cell].alive = (Math.random() > 1-globals.seed ? true : false)
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
      newBoard[cell].new = false
      newBoard[cell].alive = ((liveNeighbors === 2 || liveNeighbors === 3) ? true : false)
    } else {
      newBoard[cell].alive = (liveNeighbors === 3 ? true : false)
      newBoard[cell].new = newBoard[cell].alive ? true : false
    }
  }
  globals.board = newBoard
  return globals.board
}