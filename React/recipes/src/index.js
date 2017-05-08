/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recipes: [
        {
          recipeName: 'Duck-shaped Pickles',
          time: {
            prep: '2',
            cook: '0'
          },
          ingredients: ['pickles', 'salt'],
          directions: ['1. Cut pickles into duck-shaped pieces']
        }
      ]

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
      <RecipeBox recipes={this.state.recipes} />
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
          {this.props.recipes.map( (recipe) => 
            <Recipe key={recipe.recipeName} 
                recipe={recipe} 
            /> 
          )}
        </div>
      </div>
    )
  }
}


class Recipe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      

    }

    this.r = this.props.recipe
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
      
      <div className="col-xs-6">
        <div className="container recipe">

          <div className="row recipe-title">
            <div className="col">
              {'Duck-shaped Pickles'}
            </div>
          </div>

          <div className="row">
            <div className="col prep-time recipe-time">
              {'Prep Time: '+ this.r.time.prep + 'm'}
            </div>
            <div className="col cook-time recipe-time">
              {'Cook Time: ' + this.r.time.cook + 'm'}
            </div>
          </div>

          
          <div className="row"><div className="col section-title">{'Ingredients'}</div></div>
          <div className="row">
            <div className="col">
              <div className="recipe-ingredients recipe-section">
                <ul>
                  {this.r.ingredients.map( ing => <li key={ing}><input type='checkbox' />{ing}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="row"><div className="col section-title">{'Directions'}</div></div>
          <div className="row">
            <div className="col">
              <div className="recipe-directions recipe-section">
                <ul>
                  {this.r.directions.map( dir => <li key={dir}>{dir}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col btn-group"
                role="group"
            >
              <button className="btn btn-outline-primary" 
                  type="button"
              >{'View'}</button>
              <button className="btn btn-outline-primary"
                  type="button"
              >{'Edit'}</button>
              <button className="btn btn-outline-danger"
                  type="button"
              >{'Delete'}</button>
            </div>

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
