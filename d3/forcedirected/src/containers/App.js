/*eslint no-console: "off"*/

import React from 'react'

import { Header, Footer, Title } from '../components/Layout'
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

    const options = {
      header: {
        brand: 'D3 Force Directed Graph',
        icon: {class:'fa fa-lg fa-fw fa fa-bar-chart', height: '0.7'},
        url:'https://mackville.net'
      },
      title: {
        align: 'center',
        size: 3,
        shadow: '-3px 3px 8px #444'
      },
      canvas: {
        data: this.state.data,
        desc: this.state.description,
        height: 600,
        width: 1024
      },
      footer: {
        brand: 'Copyright © 2017 Christopher McCormack',
        icon: {class: 'fa fa-lg fa-fw fa fa-beer', height: '0.7'},
        social: [
          {name: 'Facebook', icon: 'fa fa-facebook', url: 'https://www.facebook.com/christopher.j.mccormack'},
          {name: 'Twitter', icon: 'fa fa-twitter', url: 'https://twitter.com/chrisjmccormack'},
          {name: 'Github', icon: 'fa fa-github', url: 'https://github.com/cmccormack'},
          {name: 'Linkedin', icon: 'fa fa-linkedin', url: 'https://www.linkedin.com/in/christopherjmccormack'}
        ],
        url: 'https://mackville.net'
      }
    }

    return (
      <div>
        <Header {...options.header} />
        <Title {...options.title}>{this.state.title}</Title>
        <CanvasBody {...options.canvas} />
        <Footer {...options.footer} />
      </div>
    )
  }
}



export default App


{/* <footer class="bg-inverse navbar-inverse unselectable">
  <a class="navbar-brand white-shadow" href="https://www.facebook.com/christopher.j.mccormack"
    target="_blank">
    <i class="fa fa-facebook"></i>
  </a>
  <a class="navbar-brand white-shadow" href="https://twitter.com/chrisjmccormack" target="_blank">
    <i class="fa fa-twitter"></i>
  </a>
  <a class="navbar-brand white-shadow" href="https://github.com/cmccormack" target="_blank">
    <i class="fa fa-github"></i>
  </a>
  <a class="navbar-brand white-shadow" href="https://www.linkedin.com/in/christopherjmccormack"
    target="_blank">
    <i class="fa fa-linkedin"></i>
  </a>
</footer> */}