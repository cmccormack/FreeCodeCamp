import {Grid, Row, Col} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

class App extends React.Component {

  // These methods are called when an instance of a component is being created and inserted into the DOM:
  // constructor()
  // componentWillMount()
  // render()
  // componentDidMount()
  constructor(props){
    super(props)
    this.state = {}
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {

    return (
      <div>
        <Grid>
          <Row>
            <Col className='title display-3 text-center text-shadow unselectable'>
              {'Dungeon Roguelike'}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }



}


ReactDOM.render(<App />, document.getElementById('root'))
