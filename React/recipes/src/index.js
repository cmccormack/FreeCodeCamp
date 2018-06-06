/*eslint no-console: 'off'*/

import { 
  InputGroup,
  FormControl,
  Modal,
  Button,
  Col, Row, Grid,
  OverlayTrigger, Tooltip
} from 'react-bootstrap'
import React from 'react'
import ReactDOM from 'react-dom'

var recipeTemplate = {
  recipeName: '',
  time: {
    prep: '',
    cook: ''
  },
  ingredients: [],
  directions: []
}

var recipes



class RecipeBox extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    return (
 
      <Grid>
        <Row>
          <span className='title display-3 text-center text-shadow'>{'Recipe Box'}</span>
        </Row>

        <Row>
          {recipes.map( (recipe, i) => 
            <Col
                key={recipe.recipeName}
                lg={4}
                sm={6} 
                xs={8} 
                xsOffset={2}
            >
              <Recipe
                  index={i}
                  key={recipe.recipeName}
                  recipe={recipe}
              /> 
            </Col>
            )}
          <Col
              lg={4} 
              sm={6} 
              xs={8} 
              xsOffset={2}
          >
            <NewRecipeButton
                index={recipes.length}
                recipe={recipeTemplate}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}


class Recipe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recipe: this.props.recipe,
      showViewModal: false,
      showEditModal: false
    }
    this.handleViewModalVisibleState = this.handleViewModalVisibleState.bind(this)
    this.handleEditModalVisibleState = this.handleEditModalVisibleState.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
  }


  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleViewModalVisibleState() {
    this.setState({showViewModal: this.state.showViewModal ? false : true })
  }

  handleEditModalVisibleState() {
    this.setState({showEditModal: this.state.showEditModal ? false : true })
    this.setState({recipe: recipes[this.props.index]})
  }

  handleDeleteClick(){
    recipes.splice(this.props.index, 1)
    updateDom()
  }

  render() {
    return (
      
      <Grid className='recipe'>

        <Row>
          <Col 
              className='recipe-title text-ellipsis'
              sm={12} 
          >
            {this.props.recipe.recipeName}
          </Col>
        </Row>

        <Row>
          {['Prep', 'Cook'].map( item => 
            <Col
                className={item.toLowerCase() + '-time recipe-time text-ellipsis'}
                key={item} 
                sm={6}
            >
              <i className='fa fa-clock-o' />
              {' '+ item +': ' + this.props.recipe.time[item.toLowerCase()] + 'm'}
            </Col>
          )}
        </Row>

        <Row>
          <Col sm={12}>
            <div className='section-title'>{'Ingredients'}</div>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <div className='recipe-ingredients recipe-section'>
              { this.props.recipe.ingredients.map( (ingredient) => 
                <RecipeIngredient 
                    ingredient={ingredient} 
                    key={ingredient[1]+ingredient[0]}
                    recipe={this.props.recipe}
                /> 
              )}
            </div>
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <div className='section-title'>{'Directions'}</div>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <div className='recipe-directions recipe-section'>
              <ol>
                {this.props.recipe.directions.map( dir => <li key={dir}>{dir}</li>)}
              </ol>
            </div>
          </Col>
        </Row>

        <Row>
          <Col 
              className='btn-group'
              role='group'
              sm={12}
          >
            <button 
                className='btn btn-outline-primary'
                onClick={this.handleViewModalVisibleState}
                type='button'
            >{'View'}</button>
            <button 
                className='btn btn-outline-primary'
                onClick={this.handleEditModalVisibleState}
                type='button'
            >{'Edit'}</button>
            <button 
                className='btn btn-outline-danger'
                onClick={this.handleDeleteClick}
                type='button'
            >{'Delete'}</button>
          </Col>
        </Row>
        <ViewRecipeModal 
            index={this.props.index}
            recipe={this.state.recipe}
            showModal={this.state.showViewModal}
            title={this.state.recipe.recipeName}
            toggleModal={this.handleViewModalVisibleState}
        />

        <EditRecipeModal
            index={this.props.index}
            recipe={this.state.recipe}
            showModal={this.state.showEditModal}
            title={this.state.recipe.recipeName}
            toggleModal={this.handleEditModalVisibleState}
        />
      </Grid>

    )
  }
}


class RecipeIngredient extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ingredient: this.props.ingredient
    }
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleCheckboxClick(event){
    this.props.ingredient[1] = event.currentTarget.checked ? true : false
    this.setState({ ingredient: this.props.ingredient })
    updateDom()
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
      showEditModal: false
    }
    this.handleModalVisibleState = this.handleModalVisibleState.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleModalVisibleState() {
    this.setState({showEditModal: this.state.showEditModal ? false : true })
  }
  
  render() {
    return (
      <div className='newRecipeButton'>
        <div className='inner'
            onClick={this.handleModalVisibleState}
        >
          <p>{'Add New Recipe'}</p><i className='fa fa-fw fa-2x fa-plus-square-o' />
        </div>
        <EditRecipeModal
            index={this.props.index}
            recipe={recipeTemplate}
            showModal={this.state.showEditModal}
            title={'Add New Recipe'}
            toggleModal={this.handleModalVisibleState}
        />
      </div>
    )
  }
}


class EditRecipeModal extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
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
    this.props.toggleModal()
    updateDom()
  }

  render() {

    const tooltip = (
      <Tooltip id='tooltip'>{'Separate ingredients using semicolon `;`'}</Tooltip>
    )
    return (
      <Modal show={this.props.showModal}>

        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
          <div onClick={this.props.toggleModal}><i className='fa fa-fw fa-lg fa-close' /></div>
        </Modal.Header>

        <Modal.Body>

          <Grid>
            <InputGroup>
              <InputGroup.Addon>{'Recipe Name'}</InputGroup.Addon>
              <FormControl
                  defaultValue={this.props.recipe.recipeName}
                  id='recipe-title'
                  placeholder={'Untitled'}
                  type='text'
              />
            </InputGroup>

            <Row>
              {['Prep Time', 'Cook Time'].map((item,i) => {
                var timetype = item.split(' ')[0].toLowerCase()

                return (
                  <Col 
                      className='input-group' 
                      key={item}
                      sm={6}
                  >
                    <span className='input-group-addon'>{item}</span>
                    <input
                        className='form-control'
                        defaultValue={this.props.recipe.time[timetype]}
                        id={timetype}
                        min={0}
                        placeholder={i*10+10}
                        type='number'
                    />
                    <span className='input-group-addon'>{'minutes'}</span>
                  </Col>
                )
              })}
            </Row>

            <Row>
              <Col 
                  className='input-group'
                  sm={12}
              >
                <OverlayTrigger 
                    overlay={tooltip}
                    placement='left' 
                >
                  <span className='input-group-addon'>{'Ingredients'}</span>
                </OverlayTrigger>
                <input
                    className='form-control'
                    defaultValue={this.props.recipe.ingredients.map(item => item[0]).join('; ')}
                    id={'ingredients'}
                    placeholder='e.g. salt; black pepper, ground; pickles'
                    type='text'
                />
              </Col>
            </Row>

            <Row>
              <Col 
                  className='input-group'
                  sm={12}
              >
                <span className='input-group-addon'>{'Directions'}</span>
                <textarea
                    className='form-control'
                    defaultValue={this.props.recipe.directions.join('\n')}
                    id={'directions'}
                    rows='8'
                />
              </Col>
            </Row>

          </Grid>

        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.toggleModal}>{'Close'}</Button>
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

  constructor(props) {
    super(props)
    this.state = {}
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }


  render() {
    return (
      <Modal 
          onHide={this.onClose}
          show={this.props.showModal}
      >

        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
          <div onClick={this.props.toggleModal}><i className='fa fa-fw fa-lg fa-close' /></div>
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
                <h4 className='modal-recipe-section-header'>{'Ingredients:'}</h4>
                <div className='recipe-ingredients modal-recipe-section'>
                  { this.props.recipe.ingredients.map( (ingredient) => 
                    <RecipeIngredient 
                        ingredient={ingredient} 
                        key={ingredient[1]+ingredient[0]}
                    /> 
                  )}
                </div>
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
                <h4 className='modal-recipe-section-header'>{'Directions:'}</h4>
                <div 
                    className='recipe-directions modal-recipe-section'
                    id={'directions'}
                >
                  <ol>
                    {this.props.recipe.directions.map( (item,i) => 
                      <li key={i+item.slice(10)}>{item}</li> 
                    )}
                  </ol>
                </div>
              </Col>
            </Row>

          </Grid>

        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.props.toggleModal}>{'Close'}</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}



function writeLocalStorage(prop, val){
  window.localStorage.setItem(prop, JSON.stringify(val))
}

function updateDom() {
  ReactDOM.render( <RecipeBox />, document.getElementById('root'))
  writeLocalStorage('recipes', recipes)
}

(function readLocalStorage(){
  if (window.localStorage.hasOwnProperty('recipes') && window.localStorage.recipes !== '[]') {
    recipes = JSON.parse(window.localStorage.recipes)
    updateDom()
  }
  else {
    fetch('https://mackville.net/react/recipes/recipes.json')
    .then((response)=>response.json()).then(json=>{
      recipes = json
      updateDom()
    })
  }
})()

