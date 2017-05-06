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
      <RecipeBox />
    )
  }
}


class RecipeBox extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
 
      <div className="container">
        <div className="row text-center">
          <span className="title display-3 text-center text-shadow">{'Recipe Box'}</span>
        </div>
        <div className="row">
          <Recipe />
        </div>
      </div>
    )
  }
}


class Recipe extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
 
      <div className="col-xs-6">
        <div className="container recipe">

          <div className="row recipe-title">
            <div className="col">
              {'Recipe Title'}
            </div>
          </div>

          <div className="row">
            <div className="col prep-time recipe-time">
              {'Prep Time: 12m'}
            </div>
            <div className="col cook-time recipe-time">
              {'Cook Time: 24m'}
            </div>
          </div>

          <span className="section-title">{'Ingredients'}</span>
          <div className="row">
            <div className="col recipe-ingredients" />
          </div>
        </div>
      </div>
    )
  }
}





ReactDOM.render(
  <App apiurl='https://fcctop100.herokuapp.com/api/fccusers/top/' />,
  document.getElementById('root')
)
