import React from 'react'
import ReactDOM from 'react-dom'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  shouldComponentUpdate(nextProps, nextState){
    if (this.props === nextProps && this.state===nextState){
      return false
    }
    return true
  }

  render() {
    return (
 
      <div className="container">
        <div className="row text-center">
          <span className="title display-3 text-center text-shadow">{'Free Code Camp Leaderboard'}</span>
        </div>
        <div className="row">
          {'Hello, World!'}{this.props.apiurl}
        </div>
      </div>
    )
  }
}



ReactDOM.render(
  <App apiurl='https://fcctop100.herokuapp.com/api/fccusers/top/' />,
  document.getElementById('root')
)
