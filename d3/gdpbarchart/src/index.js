/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
import { scaleTime, scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft, axisRight } from 'd3-axis'
import { timeYear } from 'd3-time'
import { select } from 'd3-selection'



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
          title: 'GDP Bar Chart'
        })
      })
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  render() {

    return (
      <div>
        <TitleBar title={this.state.title} />
        <CanvasBody 
            data={this.state.data}
            desc={this.state.description}
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
      />}
    </svg>
  )
}

function Chart(props) {
  console.log('In Chart Component')
  var chart = {
    marginTop: 40,
    marginRight: 50,
    marginBottom: 50,
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
         i % 5=== 0 ? console.log(`${v[1]}\t${chart.yScale(v[1])}`) : null
        return (
          <Rect
              fill={`hsl(${chart.color(v[1])}, 50%, 50%)`}
              height={`${chart.height - chart.yScale(v[1])}px`}
              key={v[0]+v[1]}
              width={`${barWidth}px`}
              x={chart.x + (i*barWidth)}
              y={chart.y - chart.height + chart.yScale(v[1])}
          />
        )
      })}
    </g>
  )
}

function Rect(props){
  // console.log('In Rect Component')

  var {fill, height, width, x, y} = props
  var test = {fill, height, width, x, y}
  return (
    <rect 
        {...test}
    />
  )
}


window.onload = function(){
  console.log('Window Loaded')
  ReactDOM.render(<App />, document.getElementById('root'))
}