/*eslint no-console: "off"*/

import { 
  InputGroup,
  FormControl,
  Modal,
  Button,
  Col, Row, Grid,
  OverlayTrigger, Tooltip
} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'


class App extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
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
      </Grid>
    )

  }

}



ReactDOM.render(<App />, document.getElementById('root'))
