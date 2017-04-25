import React from 'react'
import ReactDOM from 'react-dom'

const marked = require('marked')
const initText = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6\n\nAlternatively, for H1 and H2, an underline-ish style:\n\nAlt-H1\n======\n\nAlt-H2\n------\nEmphasis, aka italics, with *asterisks* or _underscores_.\n\nStrong emphasis, aka bold, with **asterisks** or __underscores__.\n\nCombined emphasis with **asterisks and _underscores_**.\n\nStrikethrough uses two tildes. ~~Scratch this.~~\n\n1. First ordered list item\n2. Another item\n⋅⋅* Unordered sub-list. \n1. Actual numbers don\'t matter, just that it\'s a number\n⋅⋅1. Ordered sub-list\n4. And another item.\n\n[I\'m an inline-style link](https://www.google.com)\n[I\'m an inline-style link with title](https://www.google.com "Google\'s Homepage")\n\nInline `code` has `back-ticks around` it.\n\nThree or more...\n\n---\n\nHyphens\n\n***\n\nAsterisks\n\n___\n\nUnderscores\n\nTables\n---\n\n| Tables        | Are           | Cool  |\n| ------------- |:-------------:| -----:|\n| col 3 is      | right-aligned | $1600 |\n| col 2 is      | centered      |   $12 |\n| zebra stripes | are neat      |    $1 |\n\n\nImages\n---\n\n![alt text](images/markdown.png "Logo Title Text 1")'


class MarkdownViewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputText: initText,
      outputText: marked(initText)
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    if (this.props === nextProps && this.state===nextState){
      return false
    }
    return true
  }

  handleChange(event) {
    this.setState({
      inputText: event.target.value,
      outputText: marked(event.target.value, {sanitize: true})
    })
  }

  clearInput(){
    this.setState({
      inputText: '',
      outputText: ''
    })
  }
  
  displayHelp(){
    this.setState({
      inputText: initText,
      outputText: marked(initText)
    })
  }
  
  handleClick(event){
    if (event.target.id === 'clear'){
      this.clearInput()
      return
    } else if (event.target.id === 'help'){
      this.displayHelp()
    }
  }

  render() {
    return (
 
      <div className="container">
        <div className="row">
          <InputForm 
              onChange={this.handleChange} 
              onClick={this.handleClick}
              value={this.state.inputText}
          />
          <OutputDiv value={this.state.outputText} />
        </div>
      </div>
    )
  }
}

class InputForm extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    if (this.props === nextProps && this.state===nextState){
      return false
    }
    return true
  }

  render() {
    return (
      <div className="col-lg-6 col-md-12 text-center">

        <form>
          <textarea
              className="inputForm"
              onChange={this.props.onChange}
              style={{boxShadow: '0px 0px 12px #444'}}
              value={this.props.value}

            
          />
        </form>
        <div className="btn-group"
            id="buttons"
        >
          <button className="btn btn-primary"
              id="clear"
              onClick={this.props.onClick}
              type="button"
          >{'Clear'}
          </button>
          <button 
              className="btn btn-default"
              id="help" 
              onClick={this.props.onClick} 
              type="button"
          >{'Help'}
          </button>
        </div>

      </div>
    )
  }
}

class OutputDiv extends React.Component {

  shouldComponentUpdate(nextProps, nextState){
    if (this.props === nextProps && this.state===nextState){
      return false
    }
    return true
  }

  render () {
    return ( 
      <div className="col">
        <div
            className="outputDiv"
            readOnly
            style={{'boxShadow': '0px 0px 12px #444', 'backgroundColor': '#EED'}}
        >
          <span dangerouslySetInnerHTML={{__html: this.props.value}} /></div>

      </div>
    )
  }
}


ReactDOM.render(
  <MarkdownViewer />,
  document.getElementById('root')
)