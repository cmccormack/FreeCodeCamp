/*eslint no-console: 'off'*/

import React from 'react'
import ReactDOM from 'react-dom'

import { Header, Footer, Title, Tooltip } from './components/Layout'
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
  let strikeData = fetch(strikeURL)

  const {width, height} = canvas

  const zoomScale = {
    min: 125,
    max: 3000,
    step: 300
  }

  // ================= Zoom functionality =================
  const zoom_handler = zoom()
    .scaleExtent([1,16])
    .translateExtent([[0-100,0-100],[width+100,height+100]])
    .on( 'zoom', ()=>{
      g.attr('transform', event.transform)

      })
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

  let g = svg.append('g')

  let paths = g.selectAll('path')
    .data(geojson.features).enter()
      .append('path')
        .attr('d', path)

  


  const tooltipdiv = document.getElementById('tt')
  const offset = {x: 10, y: -120}
  strikeData.then((response)=>response.json())
  .then((data)=>{
    g.selectAll('circle')
    .data(data.features).enter()
      .append('circle')
        .attr('cx', (d)=>projection([d.properties.reclong, d.properties.reclat])[0])
        .attr('cy', (d)=>projection([d.properties.reclong, d.properties.reclat])[1])        
        .attr('r', (d)=>d.properties.mass > 1 ? Math.pow(d.properties.mass, 1/10) : .5)
        .style('fill', ()=>`hsla(${Math.floor(Math.random()*360)}, 50%, 50%, 0.8)`)
        .style('border', '1px solid #CCC')
        .on('mouseover', showtooltip)
        .on('mouseout', ()=>{ ReactDOM.render(<Tooltip />, tooltipdiv) })
  })

  function showtooltip(d) {
    let props = {
      pos: {
        x: event.pageX + offset.x,
        y: event.pageY + offset.y
      }, 
      showTooltip: true
    }
    ReactDOM.render(
      <Tooltip {...props}>
        {
          <div>
            <div><strong>{d.properties.name}</strong></div>
            <div>{`Mass: ${d.properties.mass}`}</div>
            <div>{`Status: ${d.properties.fall}${d.properties.fall==='Found' ? ' and found' : ''}`}</div>
            <div>{`Year: ${new Date(d.properties.year).getFullYear()}`}</div>
            <div>{`Latitude: ${d.properties.reclat}`}</div>
            <div>{`Longitude: ${d.properties.reclong}`}</div>
          </div>
        }
      </Tooltip>,
      tooltipdiv 
    )
  }
}
  

export default App