/*eslint no-console: "off"*/

import { 
  InputGroup,
  FormControl,
  Modal,
  Button
} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
// import $ from 'jquery'

var recipeTemplate = {
    recipeName: 'Add New Recipe',
    time: {
      prep: '',
      cook: ''
    },
    ingredients: [],
    directions: []
  },
  recipes = [
    {
      recipeName: 'Duck-shaped Pickles',
      time: {
        prep: '10',
        cook: '10'
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

  constructor(props) {
    super(props)
    this.state = {
      showModal: false
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleClose() {
    this.setState({ showModal: false })
  }

  handleOpen() {
    this.setState({ showModal: true })
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
          <NewRecipeButton 
              handleClose={this.handleClose}
              handleOpen={this.handleOpen}
              showModal={this.state.showModal}
          />
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
            <div className='col-6 prep-time recipe-time text-ellipsis'><i className='fa fa-clock-o' />
              {' Prep: '+ this.r.time.prep + 'm'}
            </div>
            <div className='col-6 cook-time recipe-time text-ellipsis'><i className='fa fa-clock-o' />
              {' Cook: ' + this.r.time.cook + 'm'}
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
  constructor(props) {
    super(props)
    this.state = {
    }
    this._onClick = this._onClick.bind(this)
    this.r = this.props.recipe
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  _onClick(event){
    this.setState({showModal: true})
    console.log(event.currentTarget)
  }
  render() {
    return (
      <div className='col-xs-10 col-xs-offset-2 col-sm-6 col-lg-4'>
        <div className='newRecipeButton'>
          <div className='inner'
              onClick={this.props.handleOpen}
          ><p>{'Add New Recipe'}</p><i className='fa fa-fw fa-2x fa-plus-square-o' /></div>
        </div>
        <EditRecipeModal 
            handleClose={this.props.handleClose}
            recipe={recipeTemplate}
            save={this.props.handleSave}
            showModal={this.props.showModal}
        />
      </div>
    )
  }
}

class EditRecipeModal extends React.Component {

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
      <Modal 
          onHide={this.props.handleClose}
          show={this.props.showModal}
      >

        <Modal.Header closeButton>
          <Modal.Title>{this.r.recipeName}</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <div className='container-fluid'>
            <InputGroup>
              <InputGroup.Addon>{'Recipe Name'}</InputGroup.Addon>
              <FormControl 
                  placeholder={this.r.title}
                  type='text'
              />
            </InputGroup>

            <div className='row'>
              {['Prep Time', 'Cook Time'].map((item,i) => {
                return (
                  <div 
                      className="col-sm-6 input-group" 
                      key={item}
                  >
                    <span className="input-group-addon">{item}</span>
                    <input
                        className='form-control'
                        defaultValue={this.r.time[item.split(' ')[0].toLowerCase()]}
                        placeholder={i*10+10}
                        type='text'
                    />
                    <span className="input-group-addon">{'minutes'}</span>
                  </div>
                )
              })}
            </div>

            <div className='row'>
              <div className='col input-group'>
                <span className='input-group-addon'>{'Ingredients'}</span>
                <input
                    className='form-control'
                    defaultValue={this.r.ingredients.map(item => item[0]).join('; ')}
                    placeholder='salt; black pepper, ground; pickles'
                    type='text'
                />
              </div>
            </div>

            <div className='row'>
              <div className='col input-group'>
                <span className='input-group-addon'>{'Directions'}</span>
                <textarea
                    className='form-control'
                    defaultValue={this.r.directions.join('\n')}
                    rows='8'
                />
              </div>
            </div>

          </div>

        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.handleClose}>{'Close'}</Button>
          <Button bsStyle='primary'>{'Save changes'}</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}






ReactDOM.render(
  <App />,
  document.getElementById('root')
)
