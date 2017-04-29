/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      alltime: [],
      recent: [],
      time: 'recent'
    }
  }

  componentDidMount(){
    this.getApiData(this.props.apiurl, this.state.time)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  getApiData(url, time){
    $.getJSON(url + time).then( data => {this.setState( {[time]: data })} )
  }

  render() {
    return (
      <Leaderboard time={this.state[this.state.time]} />
    )
  }
}

class LeaderboardHead extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
      <thead className="thead-inverse">
        <tr>
          <th>{'#'}</th>
          <th>{'Name'}</th>
          <th>{'Past 30 Days'}</th>
          <th>{'All Time'}</th>
        </tr>
      </thead>
    )
  }
}


class Leaderboard extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
 
      <div className="container">
        <div className="row text-center">
          <span className="title display-3 text-center text-shadow">{'Free Code Camp Leaderboard'}</span>
        </div>
        <div className="row">
          <table className="table table-sm table-striped table-hover">
            <LeaderboardHead />
            <tbody>

              {this.props.time.map( (val,i) =>
                <User 
                    cookiesall={val.alltime}
                    cookiesrecent={val.recent}
                    img={val.img}
                    key={val.username}
                    name={val.username}
                    position={i+1}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }


}

class User extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
      <tr>
        <th scope="row">{this.props.position}</th>
        <td>
          <a href={'https://www.freecodecamp.com/' + this.props.name}>
            <img 
                className="avatar"
                src={this.props.img} 
            />
            {this.props.name}
          </a>
        </td>
        <td>{this.props.cookiesrecent}</td>
        <td>{this.props.cookiesall}</td>
      </tr>
    )
  }
}


ReactDOM.render(
  <App apiurl='https://fcctop100.herokuapp.com/api/fccusers/top/' />,
  document.getElementById('root')
)
