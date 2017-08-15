/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
import { scaleTime, scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft, axisRight } from 'd3-axis'
import { timeYear } from 'd3-time'
import { select } from 'd3-selection'
import { format } from 'd3-format'



var globals = {
  url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: '',
      description: ''
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
          data: json.data,
          description: json.description,
          title: 'GDP Bar Chart',
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
        <Tooltip 
            datum={this.state.datum}
            display={this.state.showTooltip}
            pos={this.state.tooltipPos}
        />
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
  data = props.data,
  barWidth = 0

  chart.xScale = scaleTime().domain([new Date(data[0][0]), new Date(data[data.length-1][0])]).nice()
  chart.yScale = scaleLinear().domain([0, data[data.length-1][1]])
  chart.color = scaleLinear().domain([0, data[data.length-1][1]]).range([190, 230])

  chart.width = props.canvas.width - chart.marginLeft - chart.marginRight
  chart.height = props.canvas.height - chart.marginTop - chart.marginBottom
  chart.x = chart.marginLeft
  chart.y = props.canvas.height - chart.marginBottom

  chart.xScale.range([chart.x, chart.width + chart.x])
  chart.yScale.range([chart.height, 0])
  
  barWidth = chart.width / data.length

  var xAxis = axisBottom(chart.xScale).ticks(timeYear.every(5)),
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
        return (
          <Rect
              datum={v}
              fill={Math.floor(chart.color(v[1]))}
              handleMouse={props.handleMouse}
              height={`${chart.height - chart.yScale(v[1])}px`}
              key={v[0]+v[1]}
              width={`${barWidth+0.5}px`}
              x={chart.x + (i*barWidth)}
              y={chart.y - chart.height + chart.yScale(v[1])}
          />
        )
      })}
    </g>
  )
}

class Rect extends React.Component {

  constructor(props){
    super(props)

    this.highlightColor = `hsl(${this.props.fill}, 50%, 80%)`
    this.fillColor = `hsl(${this.props.fill}, 50%, 50%)`
    const {x, y, height, width} = props
    this.attr = {x,y,height,width}
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
        <rect 
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

  var months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  let date = new Date(props.datum[0]),
    year = date.getFullYear(),
    month = months[date.getMonth()]

  return (
    <div 
        className='tt'
        style={{
          left: props.pos.x-500,
          top: props.pos.y-150,
          display: props.display ? 'block' : 'none'
        }}
    >
      <div style={{fontWeight: 600}}>{`${format('$,.2f')(props.datum[1])} Billion`}</div>
      <div>{`${month} ${year}`}</div>
    </div>
  )
}


window.onload = function(){
  console.log('Window Loaded')
  ReactDOM.render(<App />, document.getElementById('root'))
}