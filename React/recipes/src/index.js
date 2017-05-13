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
    directions: [
      ['Cut pickles into duck-shaped pieces']
    ]
  },
  {
    recipeName: 'Smoked Chicken Thighs',
    time: {
      prep: '10',
      cook: '120'
    },
    ingredients: [
      ['6 chicken thighs', true],
      ['4 tablespoons soy sauce', true],
      ['1 teaspoon sesame oil', true],
      ['3 garlic cloves', true],
      ['3 scallions', true],
      ['1/2 tablespoon thyme', true],
      ['1 teaspoon allspice', true],
      ['1 teaspoon pepper', true],
      ['1/2 teaspoon cinnamon', true],
      ['1/2 teaspoon red pepper', true]
    ],
    directions: [
      ['Mix soy sauce with sesame oil and lightly rub into chicken.'],
      ['In a food processor, combine garlic cloves, scallions, thyme, allspice, pepper, cinnamon, and red pepper until smooth. Rub onto and underneath skin of chicken thighs.'],
      ['Seal chicken in a plastic bag, place in fridge, and let marinate for at least 4 hours.'],
      ['Preheat smoker to 225 degrees Fahrenheit and add cherry wood chips.'],
      ['Remove chicken from fridge 30 minutes prior to cooking. Remove from marinade and place chicken in smoker.'],
      ['Smoke for 2 hours, rotating throughout cooking. Chicken thighs will be done once the internal temperature of the meat has reached 165 degrees Fahrenheit.']
    ]
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



class RecipeBox extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
 
      <div className='container'>
        <div className='row text-center'>
          <span className='title display-3 text-center text-shadow'>{'Recipe Box'}</span>
        </div>
        <div className='row'>
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
      
      <div className='col-xs-8 offset-xs-2 col-sm-6 col-lg-4'>
        <div className='container recipe text-ellipsis'>

          <div className='row'>
            <div className='col recipe-title text-ellipsis'>
              {this.r.recipeName}
            </div>
          </div>

          <div className='row'>
            <div className='col prep-time recipe-time'>
              {'Prep Time: '+ this.r.time.prep + 'm'}
            </div>
            <div className='col cook-time recipe-time'>
              {'Cook Time: ' + this.r.time.cook + 'm'}
            </div>
          </div>

          
          <div className='row'><div className='col section-title'>{'Ingredients'}</div></div>
          <div className='row'>
            <div className='col'>
              <div className='recipe-ingredients recipe-section'>
                { this.r.ingredients.map( (ingredient) => 
                  <RecipeIngredient 
                      ingredient={ingredient} 
                      key={ingredient[0]}
                  /> 
                )}
              </div>
            </div>
          </div>

          <div className='row'><div className='col section-title'>{'Directions'}</div></div>
          <div className='row'>
            <div className='col'>
              <div className='recipe-directions recipe-section'>
                <ol>
                  {this.r.directions.map( dir => <li key={dir}>{dir}</li>)}
                </ol>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col btn-group'
                role='group'
            >
              <button className='btn btn-outline-primary'
                  type='button'
              >{'View'}</button>
              <button className='btn btn-outline-primary'
                  type='button'
              >{'Edit'}</button>
              <button className='btn btn-outline-danger'
                  type='button'
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
      <div className='form-check'>
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



class NewRecipeButton extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
      <div className='col-xs-10 col-xs-offset-2 col-sm-6 col-lg-4'>
        <div className='newRecipeButton'>
          <div className='inner'
              data-target='#recipeModal'
              data-toggle='modal'
          ><p>{'Add New Recipe'}</p><i className='fa fa-fw fa-2x fa-plus-square-o' /></div>
          <RecipeModal />
        </div>
      </div>
    )
  }
}



class RecipeModal extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
      <div 
          className='modal fade' 
          id='recipeModal'
          role='dialog'
          tabIndex='-1' 
      >
        <div 
            className='modal-dialog'
            role='document'
        >
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' 
                  id='exampleModalLabel'
              >{'Modal title'}</h5>
              <button 
                  className='close'
                  data-dismiss='modal'
                  type='button' 
              >
                <span aria-hidden='true'>{'&times;'}</span>
              </button>
            </div>
            <div className='modal-body'>
              {'Modal Body'}
            </div>
            <div className='modal-footer'>
              <button 
                  className='btn btn-secondary'
                  data-dismiss='modal'
                  type='button' 
              >{'Close'}</button>
              <button 
                  className='btn btn-primary'
                  type='button'
              >{'Save changes'}</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}






ReactDOM.render(
  <App />,
  document.getElementById('root')
)
