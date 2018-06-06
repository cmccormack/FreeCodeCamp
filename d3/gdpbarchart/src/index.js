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
      description: '',
      showTooltip: false,
      tooltipPos: {x:0,y:0},
      datum: [[],[]]
    }
    this.handleTooltip = this.handleTooltip.bind(this)
  }

  componentDidMount(){
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
    datum.baseTemp = this.baseTemp
    var props = {showTooltip, pos, datum}
    ReactDOM.render(<Tooltip {...props} />, document.getElementById('tooltip'))
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
      </div>
    )
  }
}

function TitleBar(props){
  return <div className='title display-2 text-center text-shadow unselectable'>{props.title}</div>
}

function CanvasBody(props){

  var canvas = {
      width: 900,
      height: 600,
    }

  return (
    <div 
        className={'canvas-body text-center'}
        style={{width: canvas.width}}
    >
      <div className={'chart-title display-5'}>
        {'Gross Domestic Product'}
      </div>
      <svg
          className={'canvas'}
          height={600}
          width={900}
      >
        {props.data && 
        <Chart 
            canvas={canvas} 
            data={props.data}
            handleMouse={props.handleMouse}
        />}
      </svg>
      <div className={'chart-desc'}>
        {props.desc}
      </div>
    </div>
  )
}

function Chart(props) {
  var chart = {
    marginTop: 40,
    marginRight: 50,
    marginBottom: 50,
    marginLeft: 70,
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
              width={`${barWidth+1}px`}
              x={chart.x + (i*barWidth)}
              y={chart.y - chart.height + chart.yScale(v[1])}
          />
        )
      })}
      <text 
          transform={'translate(-530, 500), rotate(-90)'}
          x={chart.marginLeft}
          y={chart.y}
      >
        {'US Gross Domestic Product (in billions)'}
      </text>
      <text 
          transform={'translate(350, 45)'}
          x={chart.marginLeft}
          y={chart.y}
      >
        {'Year'}
      </text>
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
    this.setState({fill: this.highlightColor})
    this.props.handleMouse(true, {x:e.pageX, y:e.pageY}, this.props.datum)
  }
  
  handleMouseOut(e){
    this.setState({fill: this.fillColor})
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
          left: props.pos.x-210,
          top: props.pos.y-70,
          display: props.showTooltip ? 'block' : 'none'
        }}
    >
      <div style={{fontWeight: 600}}>{`${format('$,.2f')(props.datum[1])} Billion`}</div>
      <div>{`${month} ${year}`}</div>
    </div>
  )
}


window.onload = function(){
  ReactDOM.render(<App />, document.getElementById('root'))
}