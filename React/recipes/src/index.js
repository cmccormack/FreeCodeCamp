/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
// import $ from 'jquery'


var recipes = [
  {
    recipeName: 'Duck-shaped Pickles',
    time: {
      prep: '2',
      cook: '0'
    },
    ingredients: [
      ['pickles', true],
      ['salt', true],
      ['sugar', false],
      ['cumin', false],
      ['celery salt', true],
      ['black peppercorn, crushed', true],
      ['knife', true]
    ],
    directions: ['1. Cut pickles into duck-shaped pieces']
  }
]

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recipes: recipes
    }
  }

  componentDidMount(){
    console.log('DidMount')
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }



  render() {
    return (
      <RecipeBox recipes={this.state.recipes} />
    )
  }
}


class NewRecipeButton extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }



  render() {
    return (
      <div className="col-sm-6 col-md-4">
        <div className='newRecipeButton'>
          <div className="inner">{'Add New Recipe'}<br /><i className='fa fa-fw fa-2x fa-plus-square-o' /></div>
          
        </div>
      </div>
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
            <Recipe 
                key={recipe.recipeName} 
                recipe={recipe}
            /> 
          )}
          <NewRecipeButton />
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
      
      <div className="col-sm-6 col-lg-4">
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
                { this.r.ingredients.map( (ingredient) => 
                  <RecipeIngredient 
                      ingredient={ingredient} 
                      key={ingredient[0]}
                  /> 
                )}
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



class RecipeIngredient extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ingredient: this.props.ingredient,
      ing: this.props.ingredient[0],
      check: this.props.ingredient[1]
    }
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleCheckboxClick(event){
    this.props.ingredient[1] = event.currentTarget.checked ? true : false
  }

  render() {
    return (
      <div className="form-check">
        <label className='form-check-label'>
          <input 
              className='form-check-input' 
              defaultChecked={this.state.check}
              onClick={this.handleCheckboxClick}
              type='checkbox' 
              value={this.state.ing}
          />
          {this.state.ing}
        </label>
      </div>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
)
