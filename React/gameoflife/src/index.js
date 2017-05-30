/*eslint no-console: "off"*/

import { 
  Col, Row, Grid,
} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

var grid = [],
  boardSize = {
    width: 5,
    height: 10
  },
  cellSize = {
    width: 16,
    height: 16
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
          >{'Game of Life'}
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <Board 
                boardSize={this.props.boardSize}
                cellSize={this.props.cellSize}
            >{grid}</Board>
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
      grid: this.initializeGrid()
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleCellClick(cell){
    var grid = this.state.grid.slice(0)
    console.log(grid[cell.dataset.pos])
    // if (cell.classList.contains('alive')){
    //   cell.classList.remove('alive')
    // } else {
    //   cell.classList.add('alive')
    // }
  }

  initializeGrid() {
    let grid = []
    for (let row = 0, pos; row < this.props.boardSize.height; row++){
      for (let col = 0; col < this.props.boardSize.width; col++){
        pos = this.props.boardSize.width * row + col
        grid.push(
          <Cell 
              boardSize={this.props.boardSize}
              handleClick={this.handleCellClick}
              height={this.props.cellSize.height}
              key={pos}
              pos={pos}
              width={this.props.cellSize.width}
          />
        )
      }
    }
    console.log(grid)
    return grid
  }

  render() {

    const boardDivStyle = {
      width: (this.props.boardSize.width * (this.props.cellSize.width-1)) + 'px',
      height: (this.props.boardSize.height * (this.props.cellSize.height-1)) + 'px'
    }

    return (
      <div 
          className='board' 
          style={boardDivStyle}
      >
        {this.state.grid}
      </div>
    )
  }
}


function Cell(props) {
  const cellStyle = { 
    clear: (props.col % props.boardSize.width === 0) ? 'both' : '',
    width: props.width + 'px',
    height: props.height + 'px'
  }

  var handleClick = (e) => props.handleClick(e.currentTarget)

  return (
    <div 
        className={props.className || 'cell'}
        data-pos={props.pos}
        onClick={handleClick}
        style={cellStyle}
    />
  )
}


ReactDOM.render(
  <App
      boardSize={boardSize}
      cellSize={cellSize}
  />, 
  document.getElementById('root')
)
