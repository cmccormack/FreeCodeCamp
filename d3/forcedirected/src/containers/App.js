/*eslint no-console: "off"*/

import React from 'react'

import { Header, Footer } from '../components/Layout/index.js'
import CanvasBody from '../components/CanvasBody'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      description: ''
    }
  }

  componentWillMount(){
    console.log('In componentDidMount')

    // Grab data from API and store in state once App mounts
    fetch(this.props.url)
      .then((response)=>{
        console.log('Fetch ' + (response.ok? 'success!' : 'failure...'))
        return response
      })
      .then((response)=>response.json())
      .then((json)=>{
        this.setState({
          data: json,
          description: 'Bouncy Flags!!!!',
          title: 'National Contiguity using D3 Force Directed Graph'
        }, ()=>{console.log(this.state.data)}) 
      })
  }

  componentDidMount(){
        // Add a span element for the tooltip div to attach within the root element
    var tooltip = document.createElement('span')
    tooltip.id='tooltip'
    document.getElementById('root').appendChild(tooltip)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props === nextProps && this.state===nextState ? false : true
  }


  render() {
    console.log('In App Render')

    return (
      <div>
        <Header 
            brand={'Chris McCormack'}
            icon={{icon:'fa fa-lg fa-fw fa fa-bar-chart', height: '0.7'}}
            url={'https://mackville.net'}
        />
        {console.log(this.state.description)}
        <TitleBar title={this.state.title} />
        <CanvasBody 
            data={this.state.data}
            desc={this.state.description}
            height={600}
            width={900}
        />
        
        <div style={{width: '100px', height: '800px', backgroundColor: 'pink'}} />
        <Footer />
      </div>
    )
  }
}

function TitleBar(props){
  return <div className='title display-5 text-center text-shadow unselectable'>{props.title}</div>
}

export default App