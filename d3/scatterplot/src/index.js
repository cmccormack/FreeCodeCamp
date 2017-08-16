/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
import { scaleTime, scaleLinear, scaleOrdinal } from 'd3-scale'
import { axisBottom, axisLeft, axisRight } from 'd3-axis'
import { timeMin } from 'd3-time'
import { select } from 'd3-selection'
import { format } from 'd3-format'
import { extent } from 'd3-array'



var globals = {
  url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: [],
      description: '',
      tooltipPos: {x:0,y:0}
    }
    this.handleTooltip = this.handleTooltip.bind(this)
  }

  componentDidMount(){
    console.log('In componentDidMount')
    // Grab data from API and store in state once App mounts
    fetch(globals.url)
      .then((response)=>{
        console.log('Fetch ' + (response.ok? 'success!' : 'failure...'))
        return response
      })
      .then((response)=>response.json())
      .then((json)=>{
        this.setState({
          data: json,
          description: 'Doping in Professional Bicycle Racing',
          title: 'D3 Bicycling Doping Scatter Plot'
        })
      })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleTooltip(showTooltip, pos, datum) {
    this.setState({
      tooltipPos: pos,
      datum: datum,
      showTooltip: showTooltip
    })
  }

  render() {

    return (
      <div>
        <TitleBar title={this.state.title} />
        <CanvasBody 
            data={this.state.data}
            desc={this.state.description}
            handleMouse={this.handleTooltip}
        />
        {this.state.showTooltip && 
        <Tooltip 
            datum={this.state.datum}
            display={this.state.showTooltip}
            pos={this.state.tooltipPos}
        />}
      </div>
    )
  }
}

function TitleBar(props){
  return <div className='title display-2 text-center text-shadow unselectable'>{props.title}</div>
}

function CanvasBody(props){
  console.log('In CanvasBody Componenet')

  var canvas = {
      className: 'canvas',
      width: 900,
      height: 600,
      style: {
        backgroundColor: '#EEE',
        boxShadow: '-8px 8px 32px #444'
      }
    }

  return (
    <svg {...canvas}>
      {props.data && 
      <Chart 
          canvas={canvas} 
          data={props.data}
          handleMouse={props.handleMouse}
      />}
    </svg>
  )
}

function Chart(props) {
  console.log('In Chart Component')
  var chart = {
    marginTop: 40,
    marginRight: 50,
    marginBottom: 80,
    marginLeft: 50,
  },
  data = props.data

  chart.xScale = scaleTime().domain(extent(data, (d)=>new Date(d.Seconds))).nice()
  chart.yScale = scaleLinear().domain(extent(data, (d)=>d.Place))
  // chart.color = scaleLinear().domain([0, data[data.length-1][1]]).range([190, 230])

  chart.width = props.canvas.width - chart.marginLeft - chart.marginRight
  chart.height = props.canvas.height - chart.marginTop - chart.marginBottom
  chart.x = chart.marginLeft
  chart.y = props.canvas.height - chart.marginBottom

  chart.xScale.range([chart.x, chart.width + chart.x])
  chart.yScale.range([chart.height, 0])

  var xAxis = axisBottom(chart.xScale),
    yAxis = axisLeft(chart.yScale),
    yAxisRight = axisRight(chart.yScale)

  // console.log(xAxis)

  select('.canvas').append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${chart.y})`)
    .call(xAxis)
  
  select('.canvas').append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${chart.x}, ${chart.marginTop})`)
    .call(yAxis)

  select('.canvas').append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${chart.x + chart.width}, ${chart.marginTop})`)
    .call(yAxisRight)
  
  console.log(`chart.x: ${chart.x}, chart.y: ${chart.y}, chart.width: ${chart.width}, chart.height: ${chart.height}`)

  return (
    <g>
      {data.map((v,i)=>{
        console.log(v)
        return (
          <Circle
              cx={chart.xScale(v.Seconds)}
              cy={chart.yScale(v.Place)}
              datum={v}
              handleMouse={props.handleMouse}
              key={v.Name + v.Year}
              r={10}
          />
        )
      })}
    </g>
  )
}


class Circle extends React.Component {

  constructor(props){
    super(props)

    this.highlightColor = `hsl(${20}, 50%, 80%)`
    this.fillColor = `hsl(${20}, 50%, 50%)`

    const {cx, cy, r} = props
    this.attr = {cx, cy, r}

    this.state = {
      fill: this.fillColor

    }
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleMouseOver(e){
    this.props.handleMouse(true, {x:e.pageX, y:e.pageY}, this.props.datum)
  }

  handleMouseOut(e){
    this.props.handleMouse(false, {x:e.pageX, y:e.pageY}, this.props.datum)
  }

  buildToolTip(){

  }

  render (){
    return (
      <g>
        <circle 
            {...this.attr}
            fill={this.state.fill}
            onMouseOut={this.handleMouseOut}
            onMouseOver={this.handleMouseOver}
        />
      </g>
    )
  }
}


function Tooltip(props){

  return (
    <div 
        className='tt'
        style={{
          left: props.pos.x-500,
          top: props.pos.y-150,
          display: props.display ? 'block' : 'none'
        }}
    >
      <div style={{fontWeight: 600}}>{`${props.datum.Time}`}</div>
      <div>{`${props.datum.Year}`}</div>
    </div>
  )
}


window.onload = function(){
  console.log('Window Loaded')
  ReactDOM.render(<App />, document.getElementById('root'))
}