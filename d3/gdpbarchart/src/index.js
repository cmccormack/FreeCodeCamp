/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'


var globals = {
  url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: [],
      description: ''
    }
  }

  componentDidMount(){
    // Grab data from API and store in state once App mounts
    fetch(globals.url)
      .then((response)=>response.json()).then(json=>{
        this.setState({
          data: json.data,
          description: json.description,
          title: 'GDP Bar Chart'
        })
      })
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {

    return (
      <div>
        <TitleBar title={this.state.title} />
        <ChartBody data={this.state.data} />
      </div>
    )
  }
}

function TitleBar(props){
  return <div className='title display-2 text-center text-shadow unselectable'>{props.title}</div>
}

function ChartBody(props){
  var data = props.data
  console.log(data)
  return <div />
}

window.onload = function(){
  ReactDOM.render(<App />, document.getElementById('root'))
}