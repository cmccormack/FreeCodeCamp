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
      time: 'recent',

    }

    this.handleClick = this.handleClick.bind(this)
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

  handleClick(event){
    console.log(event)
  }

  render() {
    return (
      <Leaderboard 
          onClick={this.handleClick}
          time={this.state[this.state.time]} 
      />
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
            <LeaderboardHeader onClick={this.props.handleClick} />
            <LeaderboardBody time={this.props.time} />
          </table>
        </div>
      </div>
    )
  }
}


class LeaderboardHeader extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
      <thead className="thead-inverse">
        <tr>
          <th>{'#'}</th>
          <th>{'Name'}</th>
          <th>
            <div onClick={this.props.handleClick}>
              {'Past 30 Days'}
              <i 
                  className="fa fa-fw fa-lg fa-unsorted"
                  id="recent-i"
              />
            </div>
          </th>
          <th>{'All Time'}
            <i 
                className="fa fa-fw fa-lg fa-unsorted"
                id="recent-i"
            />
          </th>
        </tr>
      </thead>
    )
  }
}


class LeaderboardBody extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
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
                alt={this.props.name}
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
