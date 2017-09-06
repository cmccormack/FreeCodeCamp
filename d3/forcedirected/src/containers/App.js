/*eslint no-console: 'off'*/

import React from 'react'
import ReactDOM from 'react-dom'

import '../styles/flags/flags.min.css'
import '../images/blank.gif'

import { Header, Footer, Title, Tooltip } from '../components/Layout'
import CanvasBody from '../components/CanvasBody'
import { select, event } from 'd3-selection'
import { 
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceX,
  forceY
} from 'd3-force'
import { drag } from 'd3-drag'


class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      canvas: {
        width: 1024,
        height: 800
      }
    }
  }

  componentWillMount(){
    console.log('In componentWillMount')

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
        })
        return json
      })
      .then((json)=>{
        buildForceGraph(json.nodes, json.links, this.state.canvas)
      })
  }

  componentDidMount(){
    console.log('In componentDidMount')
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
        width: this.state.canvas.width,
        height: this.state.canvas.height
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
        <div 
            id={'canvas-wrapper'}
            style={this.state.canvas}
        >
          <div 
              id={'overlay'} 
              style={this.state.canvas}
          />
          <CanvasBody {...options.canvas} />
        </div>
        <Footer {...options.footer} />
      </div>
    )
  }
}



function handleMouseout(){
  ReactDOM.render(
    <Tooltip showTooltip={false} />
    , document.getElementById('tooltip')
  )
}

function handleMouseover(node) {

  console.log(event)
  if (!event.active){
    let offset = {x: -150, y: -50}
    let props = {
      showTooltip: true,
      pos: {x: event.x + offset.x, y: event.y + offset.y}
    }
  
    ReactDOM.render(
      <Tooltip {...props} >
        {node.country}
      </Tooltip>
      , document.getElementById('tooltip')
    )
  }
}


function buildForceGraph(nodes, links, canvas){
  console.log('in buildForceGraph function')

  const {width, height} = canvas

  const svg = select('svg')
    .style('background-color', `hsl(${Math.floor(Math.random()*360)}, 20%, 95%)`)

  
  const simulation = forceSimulation()
    .force('link', forceLink().id((d)=>d.index))
    .force('charge', forceManyBody().strength(-500))
    .force('center', forceCenter(width / 2, height / 2))
    .force('y', forceY(height/2).strength(0.6))
    .force('x', forceX(width/2).strength(0.6))

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
      .enter().append('line')
        .attr('stroke-width', ()=>1)
        .style('stroke', '#999')
        .style('opacity', '0.8')

  const node = select('#overlay')
    .attr('class', 'nodes')
    .selectAll('.node')
    .data(nodes)
      .enter().append('div')
        .attr('class', d=>`flag flag-${d.code}`)
        .call(drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
          
      )
      .on('mouseover', handleMouseover)
      .on('mouseout', handleMouseout)

  node.append('title')
      .text(d=>d.country)

  simulation
      .nodes(nodes)
      .on('tick', ticked)

  simulation.force('link')
      .links(links)

  function ticked() {
    link
        .attr('x1', d=>d.source.x)
        .attr('x2', d=>d.target.x)
        .attr('y1', d=>d.source.y)
        .attr('y2', d=>d.target.y)

    node
      .style('top', d=>`${d.y - 16}px`)
      .style('left', d=>`${d.x - 16}px`)
  }

  function dragstarted(d) {
    
    // Hide Tooltip when drag starts
    handleMouseout()

    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y

    // Deregester mouseover listeners until drag ends
    node.on('mouseover', null).on('mouseout', null)
  }
  
  function dragged(d) {
    d.fx = event.x
    d.fy = event.y
  }
  
  function dragended(d) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null

    // Register mouseover listeners once dragging ends
    node.on('mouseover', handleMouseover).on('mouseout', handleMouseout)
  }
}

export default App