/*eslint no-console: "off"*/

import { 
  InputGroup,
  FormControl,
  Modal,
  Button,
  Col, Row, Grid
} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'
// import $ from 'jquery'

var recipeTemplate = {
    recipeName: '',
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
        'Mix soy sauce with sesame oil and lightly rub into chicken.',
        'In a food processor, combine garlic cloves, scallions, thyme, allspice, pepper, cinnamon, and red pepper until smooth. Rub onto and underneath skin of chicken thighs.',
        'Seal chicken in a plastic bag, place in fridge, and let marinate for at least 4 hours.',
        'Preheat smoker to 225 degrees Fahrenheit and add cherry wood chips.',
        'Remove chicken from fridge 30 minutes prior to cooking. Remove from marinade and place chicken in smoker.',
        'Smoke for 2 hours, rotating throughout cooking. Chicken thighs will be done once the internal temperature of the meat has reached 165 degrees Fahrenheit.'
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
      showEditModal: false,
      showViewModal: false,
      currentRecipe: recipeTemplate,
      index: 0
    }
    
    this.handleClose = this.handleClose.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleView = this.handleView.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleClose() {
    this.setState({ showEditModal: false, showViewModal: false })
    ReactDOM.render( <App />, document.getElementById('root') )
  }

  handleEdit(recipe, index) {
    this.setState({ showEditModal: true, currentRecipe: recipe, currIndex: index})
  }

  handleView(recipe, index) {
    this.setState({ showViewModal: true, currentRecipe: recipe, currIndex: index})
  }

  render() {
    return (
 
      <div className='container'>
        <div className='row text-center'>
          <span className='title display-3 text-center text-shadow'>{'Recipe Box'}</span>
        </div>
        <div className='row'>
          {this.props.recipes.map( (recipe, i) => 
            <Recipe
                handleEdit={this.handleEdit}
                handleView={this.handleView}
                index={i}
                key={recipe.recipeName} 
                recipe={recipe}
            /> 
          )}

          <NewRecipeButton
              handleEdit={this.handleEdit}
          />

          { this.state.showEditModal?
            <EditRecipeModal
                handleClose={this.handleClose}
                index={this.state.currIndex}
                recipe={this.state.currentRecipe}
                showModal={this.state.showEditModal}
                title={this.state.currentRecipe.recipeName || 'Add New Recipe'}
            /> : false }

          { this.state.showViewModal?
            <ViewRecipeModal 
                handleClose={this.handleClose}
                recipe={this.state.currentRecipe}
                showModal={this.state.showViewModal}
                title={this.state.currentRecipe.recipeName}
            /> : false }

          
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
    this.onViewClick = this.onViewClick.bind(this)
    this.onEditClick = this.onEditClick.bind(this)
    this.onDeleteClick = this.onDeleteClick.bind(this)
    this.r = this.props.recipe
  }


  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  onViewClick(){
    this.props.handleView(this.props.recipe, this.props.index)
  }

  onEditClick(){
    this.props.handleEdit(this.props.recipe, this.props.index)
  }

  onDeleteClick(){
    recipes.splice(this.props.index, 1)
    ReactDOM.render( <App />, document.getElementById('root'))
    console.log(recipes)
  }

  render() {
    return (
      
      <div className='col-xs-8 offset-xs-2 col-sm-6 col-lg-4'>
        <div className='container recipe text-ellipsis'>

          <div className='row'>
            <div className='col recipe-title text-ellipsis'>
              {this.props.recipe.recipeName}
            </div>
          </div>

          <div className='row'>
            <div className='col-6 prep-time recipe-time text-ellipsis'><i className='fa fa-clock-o' />
              {' Prep: '+ this.props.recipe.time.prep + 'm'}
            </div>
            <div className='col-6 cook-time recipe-time text-ellipsis'><i className='fa fa-clock-o' />
              {' Cook: ' + this.props.recipe.time.cook + 'm'}
            </div>
          </div>

          <div className='row'><div className='col section-title'>{'Ingredients'}</div></div>
          <div className='row'>
            <div className='col'>
              <div className='recipe-ingredients recipe-section'>
                { this.props.recipe.ingredients.map( (ingredient) => 
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
                  {this.props.recipe.directions.map( dir => <li key={dir}>{dir}</li>)}
                </ol>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col btn-group'
                role='group'
            >
              <button 
                  className='btn btn-outline-primary'
                  onClick={this.onViewClick}
                  type='button'
              >{'View'}</button>
              <button 
                  className='btn btn-outline-primary'
                  onClick={this.onEditClick}
                  type='button'
              >{'Edit'}</button>
              <button 
                  className='btn btn-outline-danger'
                  onClick={this.onDeleteClick}
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
    }
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleCheckboxClick(event){
    this.props.ingredient[1] = event.currentTarget.checked ? true : false
    console.log(recipes)
  }

  render() {
    return (
      <div className='form-check'>
        <label className='form-check-label'>
          <input 
              className='form-check-input' 
              defaultChecked={this.props.ingredient[1]}
              onClick={this.handleCheckboxClick}
              type='checkbox' 
              value={this.props.ingredient[0]}
          />
          {this.props.ingredient[0]}
        </label>
      </div>
    )
  }
}



class NewRecipeButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recipe: recipeTemplate
    }
    this._onClick = this._onClick.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  _onClick() { this.props.handleEdit(this.state.recipe, recipes.length) }
  
  render() {
    return (
      <Col
          lg={4} 
          sm={6} 
          xs={10} 
          xsOffset={2}
      >
        <div className='newRecipeButton'>
          <div className='inner'
              onClick={this._onClick}
          >
            <p>{'Add New Recipe'}</p><i className='fa fa-fw fa-2x fa-plus-square-o' />
          </div>
        </div>
      </Col>
    )
  }
}



class EditRecipeModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
    this.saveRecipe = this.saveRecipe.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  saveRecipe(){
    var newRecipe = {
      recipeName: document.getElementById('recipe-title').value.trim(),
      time: {
        prep: document.getElementById('prep').value.trim() || '0',
        cook: document.getElementById('cook').value.trim() || '0'
      },
      ingredients: document.getElementById('ingredients').value.split(/\s*;\s*/)
        .map( ing => [ing.trim(), false] ).filter(ing => ing[0] !== ''),
      directions: document.getElementById('directions').value.split(/\s*\n+\s*/)
        .map(dir => dir.trim()).filter(dir => dir !== '')
    }

    if (newRecipe.recipeName === ''){
      alert('Recipe Name cannot be blank.')
      return
    }


    if (recipes.map( recipe => recipe.recipeName.toLowerCase()).indexOf(newRecipe.recipeName.toLowerCase()) !== -1) {
      if (this.props.index === recipes.length || recipes[this.props.index].recipeName.toLowerCase() !== newRecipe.recipeName.toLowerCase()) {
        alert('Recipe Names cannot be duplicates.')
        return
      }

    }
    recipes[this.props.index] = newRecipe
    ReactDOM.render( <App />, document.getElementById('root') )
    this.props.handleClose()
    console.log(this.props.index)
  }

  render() {
    return (
      <Modal show={this.props.showModal}>

        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
          <div onClick={this.props.handleClose}><i className='fa fa-fw fa-lg fa-close' /></div>
        </Modal.Header>

        <Modal.Body>

          <div className='container-fluid'>
            <InputGroup>
              <InputGroup.Addon>{'Recipe Name'}</InputGroup.Addon>
              <FormControl
                  defaultValue={this.props.recipe.recipeName}
                  id='recipe-title'
                  placeholder={'Untitled'}
                  type='text'
              />
            </InputGroup>

            <div className='row'>
              {['Prep Time', 'Cook Time'].map((item,i) => {
                var timetype = item.split(' ')[0].toLowerCase()

                return (
                  <div 
                      className="col-sm-6 input-group" 
                      key={item}
                  >
                    <span className="input-group-addon">{item}</span>
                    <input
                        className='form-control'
                        defaultValue={this.props.recipe.time[timetype]}
                        id={timetype}
                        placeholder={i*10+10}
                        type='number'
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
                    defaultValue={this.props.recipe.ingredients.map(item => item[0]).join('; ')}
                    id={'ingredients'}
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
                    defaultValue={this.props.recipe.directions.join('\n')}
                    id={'directions'}
                    rows='8'
                />
              </div>
            </div>

          </div>

        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.handleClose}>{'Close'}</Button>
          <Button 
              bsStyle='primary'
              onClick={this.saveRecipe} 
          >{'Save changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}


class ViewRecipeModal extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
      <Modal 
          onHide={this.props.handleClose}
          show={this.props.showModal}
      >

        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
          <div onClick={this.props.handleClose}><i className='fa fa-fw fa-lg fa-close' /></div>
        </Modal.Header>

        <Modal.Body>

          <Grid>
            <Row>
              {['Prep Time', 'Cook Time'].map((item) => {
                var timetype = item.split(' ')[0].toLowerCase()

                return (
                  <Col 
                      key={timetype}
                      sm={6}
                  >
                    <h4>{item + ': '}<small>{this.props.recipe.time[timetype] + ' minutes'}</small></h4>
                  </Col>
                )
              })}
            </Row>

            <Row>
              <Col sm={12}>
                <h4>{'Ingredients:'}</h4>
                <div className='recipe-ingredients modal-recipe-section'>
                  { this.props.recipe.ingredients.map( (ingredient) => 
                    <RecipeIngredient 
                        ingredient={ingredient} 
                        key={ingredient[0]}
                    /> 
                  )}
                </div>
              </Col>
            </Row>

            <div className='row'>
              <div className='col input-group'>
                <span className='input-group-addon'>{'Directions'}</span>
                <textarea
                    className='form-control'
                    defaultValue={this.props.recipe.directions.join('\n')}
                    id={'directions'}
                    rows='8'
                />
              </div>
            </div>

          </Grid>

        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.handleClose}>{'Close'}</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
)
