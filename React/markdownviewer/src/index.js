import React from 'react'
import ReactDOM from 'react-dom'



class MarkdownViewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputText: 'This is some text',
      outputText: ''
    }

    this.handleChange = this.handleChange.bind(this)
  }

  ComponentDidUpdate() {
    this.setState({inputText: 'testing'})
  }

  handleChange(event){
    this.setState({
      inputText: event.target.value,
      outputText: event.target.value
    })
  }

  render() {
    return (
 
      <div className="container">
        <div className="row text-center">
          <InputForm value={this.state.inputText} onChange={this.handleChange}/>
          <OutputForm value={this.state.outputText} />
        </div>
      </div>
    )
  }
}

class InputForm extends React.Component {

  render() {
    return (
      <div className="col">
        <form>
          <textarea
            id="inputForm"
            style={{boxShadow: '0px 0px 12px #444'}}
            cols={50} 
            rows={20}
            value={this.props.value}
            onChange={this.props.onChange.bind(this)}
          />
        </form>
      </div>
    )
  }
}

class OutputForm extends React.Component {
  render () {
    return ( 
      <div className="col">
        <form>
          <textarea 
            id="outputForm"
            style={{'boxShadow': '0px 0px 12px #444', 'backgroundColor': '#EED'}}
            cols={50} 
            rows={20}
            readOnly
            value={this.props.value}
          />
        </form>
      </div>
    )
  }
}






ReactDOM.render(
  <MarkdownViewer />,
  document.getElementById('root')
)