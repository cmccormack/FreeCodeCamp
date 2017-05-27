/*eslint no-console: "off"*/

import { 
  // InputGroup,
  // FormControl,
  // Button,
  Col, Row, Grid,
} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

var grid = [],
  boardSize = {
    width: 20,
    height: 20
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
    console.log(this.props)
    for (let i = 0; i < this.props.boardSize.width * this.props.boardSize.height; i++){
      console.log(i, (i % (this.props.boardSize.height)) === 0)
      grid.push(
        <Cell 
            boardSize={this.props.boardSize}
            col={i % this.props.boardSize.width}
            key={i}
            row={Math.floor(i / this.props.boardSize.height)}
        />
      )
    }
  }

  render() {
    console.log(grid)
    return (
      <div className='board'>{grid}</div>
    )
  }
}


class Cell extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {

    return (
      <div 
          className='cell'
          data-pos={this.props.row + ',' + this.props.col}
          style={{ clear: (this.props.col % this.props.boardSize.width === 0) ? 'both' : '' }}
      />
    )
  }
}


ReactDOM.render(<App boardSize={boardSize} />, document.getElementById('root'))
