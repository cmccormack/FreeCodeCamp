/*eslint no-console: 'off'*/

import React from 'react'
import ReactDOM from 'react-dom'

import { Header, Footer, Title, Tooltip } from './components/Layout'
import CanvasBody from './components/CanvasBody'

import { select, event } from 'd3-selection'
import { geoPath, geoTransverseMercator } from 'd3-geo'
import { zoom } from 'd3-zoom'
import { scaleThreshold } from 'd3-scale'

import countryData from './assets/cc-slim-2.json'
import topology from './assets/world-110m2.json'
import strikeData from './assets/meteorite-strike-data.json'

import * as topojson from 'topojson-client'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      canvas: {
      },
      title: 'Meteorite Landings Across the Globe using D3'
    }
  }
  
  componentWillMount(){
    document.body.insertAdjacentHTML( 'afterbegin', '<div id="tt"></div>' )
  }
  componentDidMount(){
    console.log('In componentDidMount')

    buildWorldMap()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {
    console.log('In App Render')

    const options = {
      header: {
        brand: {
          title: 'D3 Meteorite Map Data',
          icon: {class:'fa fa-lg fa-fw fa fa-bar-chart', height: '0.7'},
          url:'https://mackville.net'
        },
        navItems: [
          {name: 'Portfolio', url: '/'},
          {name: 'Contact', url: '/#contact'}
        ],
        dropdown: {
          title: 'Other D3 Projects',
          id: 'nav-dropdown-projects',
          menuItems: [
            {name: 'Bar Chart', url: '../gdpbarchart'},
            {name: 'Scatterplot', url: '../scatterplot'},
            {name: 'Heatmap', url: '../heatmap'},
            {name: 'Force Directed Graph', url: '../forcedirected'},
          ],
          footer: [
            {name: 'FreeCodeCamp', url: 'https://www.freecodecamp.com'}
          ]
        }
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
      <div className={'main'}>
        <Header {...options.header} />
        <Title {...options.title}>{this.state.title}</Title>
        <CanvasBody {...options.canvas} />
        <Footer {...options.footer} />
      </div>
    )
  }
}



function buildWorldMap(){
  console.log('in buildWorldMap function')

  let width = parseInt(select('.main').style('width'))
  let mapRatio = .75
  let strikeScale = 3072 // Arbitrary number for scaling impact strikes
  let height = width * mapRatio

  const tooltipdiv = document.getElementById('tt')

  // ================= Zoom functionality =================
  const zoom_handler = zoom()
    .scaleExtent([1,16])
    .translateExtent([[0-100,0-100],[width+100,height+100]])
    .on( 'zoom', ()=>{ g.attr('transform', event.transform) })
  // ======================================================


  // Setup scale and position of World Map Projection
  const projection = geoTransverseMercator()
    .translate([width/2,height/2])
    .scale(height / 6.4) // Arbitrary value, looks nice

  // Create new geographic path generator using current projection
  const path = geoPath().projection(projection)

  // Get the geoJSON feature collection data for countries
  const geojson = topojson.feature(topology, topology.objects.countries)

  // Convert country code data into an object for fast lookups
  let countryObj = countryData.reduce((obj,item)=>{
      obj[+item['country-code']]=item
      return obj 
    },{})


  // Build our SVG and group for path elements and strike data
  const svg = select('svg')
    .style('background-color', `hsl(${200}, 40%, 75%)`)
    .attr('width', width)
    .attr('height', height)
    .call(zoom_handler)

  const g = svg.append('g')
  
  // Use scaleThreshold to derive a pixel size from meteorite mass arbitrarily
  // Used Fibonnacci to better distinguish sizes of impacts
  let scaleMassSizes = scaleThreshold()
    .domain([0, 1000, 2000, 5000, 10000, 50000, 100000, 500000, 1000000, 10000000, 20000000])
    .range( [1,    1,    2,    3,     5,     8,     13,     21,      34,       55,       89])


  // Draw Path Data
  let paths = g.selectAll('path')
  .data(geojson.features).enter()
    .append('path')
      .attr('id', (d)=>String(d.id))
      .attr('d', path)
      .on('mouseover', (d)=> {showPathTooltip(countryObj[d.id].name)})
      .on('mouseout', hideTooltip)

  // Sort Strike Data descending then draw
  strikeData.features.sort((a,b)=>b.properties.mass - a.properties.mass)
  let circles = g.selectAll('circle')
  .data(strikeData.features).enter()
    .append('circle')
      .attr('cx', (d)=>projection([d.properties.reclong, d.properties.reclat])[0])
      .attr('cy', (d)=>projection([d.properties.reclong, d.properties.reclat])[1])        
      .attr('r', (d)=>scaleMassSizes(d.properties.mass)/(strikeScale/width))
      .style('fill', ()=>`hsl(${Math.floor(Math.random()*360)}, 40%, 50%)`)
      .style('fill-opacity', '.6')
      .style('stroke', '#555')
      .style('stroke-width', '.1')
      .on('mouseover', function(d){
        select(this)
          .style('fill-opacity', '.9')
          .style('stroke-width', '.8')
        showStrikeTooltip(d)}
      )
      .on('mouseout', function(){
        select(this)
          .style('fill-opacity', '.6')
          .style('stroke-width', '.1')
        hideTooltip()}
      )



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


  // Helper function for rendering tooltip
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


  // Helper function for hiding tooltip
  function hideTooltip(){
    ReactDOM.render(<Tooltip />, tooltipdiv)
  }

  select(window).on('resize', resize)
  
  function resize(){

    // Adjust things when the window size changes
    width = parseInt(select('.main').style('width'))
    height = width * mapRatio
  
    // Update projection
    projection
        .translate([width / 2, height / 2])
        .scale(height/6.4)
  
    // Resize the map container
    svg
        .style('width', width + 'px')
        .style('height', height + 'px')
  
    // Resize the map
    paths.attr('d', path)
    
    circles
      .attr('cx', (d)=>projection([d.properties.reclong, d.properties.reclat])[0])
      .attr('cy', (d)=>projection([d.properties.reclong, d.properties.reclat])[1])
      .attr('r', (d)=>scaleMassSizes(d.properties.mass)/(strikeScale/width))
  }
}

export default App