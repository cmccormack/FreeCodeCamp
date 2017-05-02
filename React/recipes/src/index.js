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
    var recent = $.getJSON(this.props.apiurl + 'recent')
    var alltime = $.getJSON(this.props.apiurl + 'alltime')
    $.when(recent, alltime).done( (r, a) => {
      r[0].map(this.parseLastUpdate)
      a[0].map(this.parseLastUpdate)
      this.setState( {recent: r[0], alltime: a[0]} )
    })
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleClick(event, time){
    this.setState({time})
    $('.i-sort').removeClass('fa-unsorted fa-sort-amount-desc')
    $('#' + time + '-i').addClass('fa-sort-amount-desc')
  }

  parseLastUpdate(user){
    var date = new Date(user.lastUpdate),
      month = date.toLocaleString('en-us', { month: 'long' })
    user.lastUpdate = month + ' ' + date.getDate() + ', ' + date.getFullYear()
  }

  render() {
    return (
      <Leaderboard 
          data={this.state[this.state.time]}
          handleClick={this.handleClick}
          time={this.state.time}
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
            <LeaderboardHeader handleClick={this.props.handleClick} />
            <LeaderboardBody data={this.props.data} />
          </table>
        </div>
      </div>
    )
  }
}


class LeaderboardHeader extends React.Component {

  constructor(props) {
    super(props)

    this._onClick = this._onClick.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  _onClick(event){
    this.props.handleClick(event, event.currentTarget.id)
  }

  render() {
    return (
      <thead className='thead-inverse unselectable'>
        <tr>
          <th width='5%' className='text-center'>{'#'}</th>
          <th width="40%">{'Name'}</th>
          <th width="25%">{'Last Updated'}</th>
          <th 
              className='header-sort'
              id='recent'
              onClick={this._onClick}
              width='15%'
          >{'Past 30 Days'}
            <i 
                className='fa fa-fw fa-lg fa-unsorted i-sort'
                id='recent-i'
            />
          </th>
          <th 
              className='header-sort'
              id='alltime'
              onClick={this._onClick}
              width='15%'
          >{'All Time'}
            <i 
                className='fa fa-fw fa-lg fa-unsorted i-sort'
                id='alltime-i'
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

        {this.props.data.map( (val,i) =>
          <User 
              cookiesall={val.alltime}
              cookiesrecent={val.recent}
              img={val.img}
              lastUpdate={val.lastUpdate}
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
        <th scope="row" className="text-center">{this.props.position}</th>
        <td>
          <a 
            href={'https://www.freecodecamp.com/' + this.props.name}
            target="_blank"
          >
            <img 
                alt={this.props.name}
                className="avatar"
                src={this.props.img}
            />
            {this.props.name}
          </a>
        </td>
        <td>{this.props.lastUpdate}</td>
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
