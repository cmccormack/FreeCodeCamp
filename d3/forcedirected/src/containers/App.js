/*eslint no-console: 'off'*/

import React from 'react'

import { Header, Footer, Title } from '../components/Layout'
import CanvasBody from '../components/CanvasBody'
import { select, selectAll, event } from 'd3-selection'
import { 
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceX,
  forceY
} from 'd3-force'
import { drag } from 'd3-drag'
import { scaleOrdinal, schemeCategory20 } from 'd3-scale'


const nodes = [
  { id: 'mammal', group: 0, label: 'Mammals', level: 1 },
  { id: 'dog'   , group: 0, label: 'Dogs'   , level: 2 },
  { id: 'cat'   , group: 0, label: 'Cats'   , level: 2 },
  { id: 'fox'   , group: 0, label: 'Foxes'  , level: 2 },
  { id: 'elk'   , group: 0, label: 'Elk'    , level: 2 },
  { id: 'insect', group: 1, label: 'Insects', level: 1 },
  { id: 'ant'   , group: 1, label: 'Ants'   , level: 2 },
  { id: 'bee'   , group: 1, label: 'Bees'   , level: 2 },
  { id: 'fish'  , group: 2, label: 'Fish'   , level: 1 },
  { id: 'carp'  , group: 2, label: 'Carp'   , level: 2 },
  { id: 'pike'  , group: 2, label: 'Pikes'  , level: 2 }
]

const links = [
	{ target: 'mammal', source: 'dog' , strength: 0.7 },
	{ target: 'mammal', source: 'cat' , strength: 0.7 },
  { target: 'mammal', source: 'fox' , strength: 0.7 },
  { target: 'mammal', source: 'elk' , strength: 0.7 },
  { target: 'insect', source: 'ant' , strength: 0.7 },
  { target: 'insect', source: 'bee' , strength: 0.7 },
  { target: 'fish'  , source: 'carp', strength: 0.7 },
  { target: 'fish'  , source: 'pike', strength: 0.7 },
  { target: 'cat'   , source: 'elk' , strength: 0.1 },
  { target: 'carp'  , source: 'ant' , strength: 0.1 },
  { target: 'elk'   , source: 'bee' , strength: 0.1 },
  { target: 'dog'   , source: 'cat' , strength: 0.1 },
  { target: 'fox'   , source: 'ant' , strength: 0.1 },
	{ target: 'pike'  , source: 'cat' , strength: 0.1 }
]

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
        <CanvasBody {...options.canvas} />
        <Footer {...options.footer} />
      </div>
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
    .force('collide', forceCollide( (d)=>15 ).iterations(16) )
    .force('charge', forceManyBody().strength(-280))
    .force('center', forceCenter(width / 2, height / 2))
    .force('y', forceY(0).strength(0.6))
    .force('x', forceX(0).strength(0.6))

  const link = svg.append('g')
    .attr('class', 'links')
    .selectAll('line')
    .data(links)
      .enter().append('line')
        .attr('stroke-width', ()=>2)
        .style('stroke', '#999')
        .style('opacity', '0.8')

  // selectAll('.line')
  //   .style({stroke: '#999', opacity: '0.8'})  

  const node = svg.append('g')
    .attr('class', 'nodes')
    .selectAll('circle')
    .data(nodes)
      .enter().append('circle')
        .attr('r', 10)
        .attr('fill', ()=>`hsl(${Math.floor(Math.random()*360)}, 50%, 50%)`)
        .call(drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )

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
        .attr('y2', d=>d.target.y)
        .attr('y1', d=>d.source.y)
        .attr('x2', d=>d.target.x)

    node
        .attr('cx', d=>d.x)
        .attr('cy', d=>d.y)
  }

  function dragstarted(d) {
    if (!event.active) simulation.alphaTarget(0.2).restart()
    d.fx = d.x
    d.fy = d.y
  }
  
  function dragged(d) {
    d.fx = event.x
    d.fy = event.y
  }
  
  function dragended(d) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
}

export default App