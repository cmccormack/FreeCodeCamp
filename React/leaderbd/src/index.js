import React from 'react'
import ReactDOM from 'react-dom'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    var counter = 0

    return (
 
      <div className="container">
        <div className="row text-center">
          <span className="title display-3 text-center text-shadow">{'Free Code Camp Leaderboard'}</span>
        </div>
        <div className="row">
          <table className="table table-sm table-striped table-hover">
            <thead className="thead-inverse">
              <tr>
                <th>{'#'}</th>
                <th>{'Name'}</th>
                <th>{'Cookies'}</th>
              </tr>
            </thead>
            <tbody>
              <User cookies="422" 
                  name="Chris" 
                  position={++counter}
              />
              <User cookies="100" 
                  name="David" 
                  position={++counter}
              />
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}


class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  shouldComponentUpdate(nextProps, nextState){
    this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
      <tr>
        <th scope="row">{this.props.position}</th>
        <td>{this.props.name}</td>
        <td>{this.props.cookies}</td>
      </tr>
    )
  }
}


ReactDOM.render(
  <App apiurl='https://fcctop100.herokuapp.com/api/fccusers/top/' />,
  document.getElementById('root')
)
