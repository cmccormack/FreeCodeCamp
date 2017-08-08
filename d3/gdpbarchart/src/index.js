import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
  }

  componentDidMount(){
    // Grab ajax data
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

render() {

    return (
      <div>
        <div className='title display-2 text-center text-shadow unselectable'>
          {'GDP Bar Chart'}
        </div>
      </div>
    )
  }

}

window.onload = function(){
  ReactDOM.render(<App />, document.getElementById('root'))
}