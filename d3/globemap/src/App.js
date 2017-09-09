/*eslint no-console: 'off'*/

import React from 'react'
import ReactDOM from 'react-dom'

import { Header, Footer, Title, Tooltip } from './components/Layout'
import CanvasBody from './components/CanvasBody'

import { select, event } from 'd3-selection'
import { geoPath, geoTransverseMercator } from 'd3-geo'
import { zoom } from 'd3-zoom'
import { scaleQuantile } from 'd3-scale'

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
    let worldMap = fetch(this.props.url.worldMap)
    worldMap.then((response)=>response.json())
      .then((json)=>{
        this.setState({
          description: '',
          title: 'Meteorite Landings Across the Globe using D3'
        })
        buildWorldMap(json, this.state.canvas)
      })
  }

  componentDidMount(){
    console.log('In componentDidMount')
    document.body.insertAdjacentHTML( 'afterbegin', '<div id="tt"></div>' )
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

  let strikeURL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json'
  let countryURL = 'https://mackville.net/d3/globemap/cc-slim-2.json'
  let strikeData = fetch(strikeURL).then((response)=>response.json())
  let countryData = fetch(countryURL).then((response)=>response.json())

  const {width, height} = canvas
  const tooltipdiv = document.getElementById('tt')


  // ================= Zoom functionality =================
  const zoom_handler = zoom()
    .scaleExtent([1,16])
    .translateExtent([[0-100,0-100],[width+100,height+100]])
    .on( 'zoom', ()=>{ g.attr('transform', event.transform) })
  // ======================================================


  const projection = geoTransverseMercator()
    .center([0,68])
    .scale(125)

  let path = geoPath().projection(projection)

  const svg = select('svg')
    .style('background-color', `hsl(${200}, 40%, 75%)`)
    .attr('width', width)
    .attr('height', height)
    .call(zoom_handler)

  const g = svg.append('g')
  
  const geojson = topojson.feature(topology, topology.objects.countries)

  

  
  // Convert country code data into an object for fast lookups
  countryData.then((countryArr)=>
    countryArr.reduce((obj,item)=>{
      obj[+item['country-code']]=item
      return obj 
    },{}))
  .then((countryObj)=>{
    drawPathData(countryObj)
    strikeData.then(drawStrikeData)
  })

  function drawPathData(countries){
    g.selectAll('path')
    .data(geojson.features).enter()
      .append('path')
        .attr('id', (d)=>String(d.id))
        .attr('d', path)
        .on('mouseover', (d)=> {showPathTooltip(countries[d.id].name)})
        .on('mouseout', hideTooltip)
  }

  function drawStrikeData(data){

    let masses = data.features.map(d=>d.properties.mass)
    let scaleMasses = scaleQuantile()
      .domain(masses)
      .range([1,2,3,4,5,6,7,8,9,10])


    console.log(scaleMasses())

    g.selectAll('circle')
    .data(data.features).enter()
      .append('circle')
        .attr('cx', (d)=>projection([d.properties.reclong, d.properties.reclat])[0])
        .attr('cy', (d)=>projection([d.properties.reclong, d.properties.reclat])[1])        
        .attr('r', (d)=>d.properties.mass > 1 ? Math.pow(d.properties.mass, 1/10) : .5)
        .style('fill', ()=>`hsla(${Math.floor(Math.random()*360)}, 50%, 40%, 0.6)`)
        .style('stroke', '#EEE')
        .style('stroke-width', '.1')
        .on('mouseover', showStrikeTooltip)
        .on('mouseout', hideTooltip)

    return data
  }

  function showTooltip(event, offset, showTooltip, tooltipBody) {

    let props = {
      pos: {
        x: event.pageX + offset.x,
        y: event.pageY + offset.y
      },
      showTooltip
    }
    ReactDOM.render(<Tooltip {...props}>{tooltipBody}</Tooltip>, tooltipdiv )
  }

  function hideTooltip(){
    ReactDOM.render(<Tooltip />, tooltipdiv)
  }

  function showStrikeTooltip(d) {
    showTooltip(event, {x: 10, y: -120}, true,
      <div>
        <div><strong>{d.properties.name}</strong></div>
        <div>{`Mass: ${d.properties.mass}`}</div>
        <div>{`Status: ${d.properties.fall}${d.properties.fall==='Found' ? ' and found' : ''}`}</div>
        <div>{`Year: ${new Date(d.properties.year).getFullYear()}`}</div>
        <div>{`Latitude: ${d.properties.reclat}`}</div>
        <div>{`Longitude: ${d.properties.reclong}`}</div>
      </div>
    )
  }

  function showPathTooltip(d) {
    showTooltip(event, {x: 10, y: -50}, true,
      <div><strong>{d}</strong></div>
    )
  }
}
  

export default App