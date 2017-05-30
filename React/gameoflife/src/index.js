/*eslint no-console: "off"*/

import { 
  Col, Row, Grid,
} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

var globals = {
  board: [],
  boardSize: {
    columns: 30,
    rows: 30,
    cells: 0,
    padding: 10
  },
  cellSize: {
    width: 16,
    height: 16
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
    this.handleCellClick = this.handleCellClick.bind(this)
    this.state = {
      board: globals.board
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleCellClick(cell){
    globals.board[cell.dataset.pos].class = globals.board[cell.dataset.pos].class.includes('dead') ? 
    'cell alive' : 'cell dead'
    this.setState({board: globals.board})
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


function Cell(props) {


  var handleClick = (e) => props.handleClick(e.currentTarget)

  return (
    <div 
        className={props.class}
        data-pos={props.id}
        id={props.id}
        onClick={handleClick}
        style={{width: globals.cellSize.width, height: globals.cellSize.height}}
    />
  )
}





window.onload = function(){

  initializeBoard()

  ReactDOM.render(<App board={globals.board} />, 
    document.getElementById('root')
  )
}


var initializeBoard = () => {
  globals.boardSize.cells = globals.boardSize.columns * globals.boardSize.rows
  for (var i=0; i < globals.boardSize.cells; i++){

    globals.board.push({id: i, key: i, class: Math.random() > 0.9 ? 'cell alive' : 'cell dead'})
  }
  return globals.board
}