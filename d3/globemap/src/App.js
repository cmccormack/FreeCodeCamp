/*eslint no-console: 'off'*/

import React from 'react'

import { Header, Footer, Title } from './components/Layout'
import CanvasBody from './components/CanvasBody'

import { select, event } from 'd3-selection'
import { geoPath, geoTransverseMercator } from 'd3-geo'
import { zoom } from 'd3-zoom'

import * as topojson from 'topojson-client'

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
    fetch(this.props.url.worldMap)
      .then((response)=>{
        console.log('Fetch ' + (response.ok? 'success!' : 'failure...'))
        return response
      })
      .then((response)=>response.json())
      .then((json)=>{
        this.setState({
          data: json,
          description: '',
          title: 'Meteorite Landings Across the Globe using D3'
        })
        return json
      })
      .then((json)=>{
        buildWorldMap(json, this.state.canvas)
      })
  }

  componentDidMount(){
    console.log('In componentDidMount')

  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props === nextProps && this.state===nextState ? false : true
  }


  render() {
    console.log('In App Render')

    const options = {
      header: {
        brand: 'D3 Meteorite Map Data',
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


function buildWorldMap(topology, canvas){
  console.log('in buildWorldMap function')

  const {width, height} = canvas

  const zoomScale = {
    min: 125,
    max: 3000,
    step: 300
  }

  // ================= Zoom functionality =================
  const zoom_handler = zoom().scaleExtent([1,10])  
    .on( 'zoom', ()=>paths.attr('transform', event.transform) )
  // ======================================================


  const projection = geoTransverseMercator()
    .center([0,68])
    .scale(zoomScale.min)

  let path = geoPath().projection(projection)

  const svg = select('svg')
    .style('background-color', `hsl(${200}, 40%, 75%)`)
    .attr('width', width)
    .attr('height', height)
    .call(zoom_handler)

  const geojson = topojson.feature(topology, topology.objects.countries)

  let paths = svg.selectAll('path')
    .data(geojson.features).enter()
      .append('path')
        .attr('d', path)

}
  

export default App