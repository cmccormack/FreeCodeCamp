/*eslint no-console: "off"*/

import { 
  Col, Row, Grid,
} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

var grid = [],
  boardSize = {
    width: 50,
    height: 30
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
    this.state = {
      grid: this.initializeGrid()
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  initializeGrid() {
    for (let row = 0; row < this.props.boardSize.height; row++){
      for (let col = 0; col < this.props.boardSize.width; col++){
        grid.push(
          <Cell 
              boardSize={this.props.boardSize}
              col={col}
              height={this.props.cellSize.height}
              key={row + ',' + col}
              row={row}
              style={{clear: col % this.props.boardSize.width === 0 ? 'both' : ''}}
              width={this.props.cellSize.width}
          />
        )
      }
    }
  }

  render() {

    const boardDivStyle = {
      width: (this.props.boardSize.width * (this.props.cellSize.width-1)) + 'px',
      height: (this.props.boardSize.height * (this.props.cellSize.height-1)) + 'px'
    }
    console.log(grid)
    return (
      <div className='board' style={boardDivStyle}>{grid}</div>
    )
  }
}


function Cell(props) {
  return (
    <div 
        className='cell'
        data-pos={props.row + ',' + props.col}
        style={{ 
          clear: (props.col % props.boardSize.width === 0) ? 'both' : '',
          width: props.width + 'px',
          height: props.height + 'px'
        }}
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
