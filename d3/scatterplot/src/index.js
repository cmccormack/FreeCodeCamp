/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
import { scaleTime, scaleLinear } from 'd3-scale'
import { axisBottom, axisLeft, axisRight } from 'd3-axis'
import { timeSecond } from 'd3-time'
import { select } from 'd3-selection'
import { timeFormat } from 'd3-time-format'
import { extent, max, min } from 'd3-array'



var globals = {
  url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: [],
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
          data: json,
          description: 'Doping in Professional Bicycle Racing',
          title: 'D3 Bicycling Doping Scatter Plot'
        })
      })

    // Add a span element for the tooltip div to attach within the root element
    var tooltip = document.createElement('span')
    tooltip.id='tooltip'
    document.getElementById('root').appendChild(tooltip)

  }

  shouldComponentUpdate(nextProps, nextState) {
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
  return <div className='title display-4 text-center text-shadow unselectable'>{props.title}</div>
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
      marginBottom: 80,
      marginLeft: 50,
      xAxis: {
        marginLeft: 15,
        marginRight: 150
      },
      key: [
        {
          name: 'doping',
          cx: 600,
          cy: 320,
          color: 20,
          desc: 'Doping Allegations'
        },
        {
          name: 'noDoping',
          cx: 600,
          cy: 350,
          color: 120,
          desc: 'No Doping Allegations'
        }
      ]
    },
    data = props.data,
    maxTime = max(data, (d)=>d.Seconds),
    minTime = min(data, (d)=>d.Seconds)

  chart.xScale = scaleTime().domain([new Date((maxTime+15-minTime)*1000), new Date(0)])
  chart.xScale.ticks(timeSecond.every(30))
  chart.yScale = scaleLinear().domain(extent(data, (d)=>d.Place))

  chart.width = props.canvas.width - chart.marginLeft - chart.marginRight
  chart.height = props.canvas.height - chart.marginTop - chart.marginBottom
  chart.x = chart.marginLeft
  chart.y = props.canvas.height - chart.marginBottom

  chart.xScale.range([chart.xAxis.marginLeft + chart.x, chart.width + chart.x - chart.xAxis.marginRight])
  chart.yScale.range([chart.marginTop, chart.height+chart.marginTop])

  var xAxis = axisBottom(chart.xScale).tickFormat(timeFormat('%M:%S')),
    yAxis = axisLeft(chart.yScale),
    yAxisRight = axisRight(chart.yScale)

  select('.canvas').append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${chart.y + 10})`)
    .call(xAxis)
  
  select('.canvas').append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${chart.x}, ${0})`)
    .call(yAxis)

  select('.canvas').append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${chart.x + chart.width}, ${0})`)
    .call(yAxisRight)

  return (
    <g>
      {data.map((v)=>{
        return (
          <Circle
              className={'circle'}
              color={v.Doping ? chart.key[0].color : chart.key[1].color}
              cx={chart.xScale(new Date((v.Seconds - minTime)*1000))}
              cy={chart.yScale(v.Place)}
              datum={v}
              key={v.Name + v.Year}
              r={5}
          />
        )
      })}
      {chart.key.map((v)=>{
        return (
          <g key={v.name}>
            <circle
                className={'circle'}
                cx={v.cx}
                cy={v.cy}
                fill={`hsl(${v.color}, 80%, 40%)`}
                r={5}
            />
            <text
                fontSize={12}
                x={v.cx+15}
                y={v.cy+4}
            >
              {v.desc}
            </text>
          </g>
        )
      })}
      <text 
          transform={'translate(-500, 350), rotate(-90)'}
          x={chart.marginLeft}
          y={chart.y}
      >
        {'Ranking'}
      </text>
      <text 
          transform={'translate(230, 50)'}
          x={chart.marginLeft}
          y={chart.y}
      >
        {'Minutes Behind Fastest Time'}
      </text>
    </g>
  )
}


class Circle extends React.Component {

  constructor(props){
    super(props)

    
    this.highlightColor = `hsl(${this.props.color}, 80%, 60%)`
    this.fillColor = `hsl(${this.props.color}, 80%, 40%)`
    const {cx, cy, r, className} = props
    this.attr = {cx, cy, r, className}

    this.state = {
      fill: this.fillColor,
      fontSize: 10,
      tag: {
        marginLeft: 10,
        marginTop: 4
      }

    }
    this.handleMouseOver = this.handleMouseOver.bind(this)
    this.handleMouseOut = this.handleMouseOut.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState){
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleMouseOver(){
    let props = {showTooltip: true, datum:this.props.datum}
    ReactDOM.render(<Tooltip {...props} />, document.getElementById('tooltip'))
    this.setState({fill: this.highlightColor})
  }

  handleMouseOut(){
    this.setState({fill: this.fillColor})
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
        <text
            fontSize={this.state.fontSize}
            onMouseOut={this.handleMouseOut}
            onMouseOver={this.handleMouseOver}
            x={this.props.cx + this.state.tag.marginLeft}
            y={this.props.cy + this.state.tag.marginTop}
        >
          {this.props.datum.Name}
        </text>
      </g>
    )
  }
}


function Tooltip(props){

  return (
    <div 
        className='tt'
        style={{
          left: 150,
          top: 150,
          display: props.showTooltip ? 'block' : 'none',
          fontSize: '12px'
        }}
    >
      <div>
        <a 
            href={props.datum.URL}
            style={{fontWeight: 600}}
            target={'_blank'}
        >
          {props.datum.Name}
        </a>
        {' - '}
        {props.datum.Nationality}
      </div>
      <div>
        {`${props.datum.Year}, Place: ${props.datum.Place}, Time: ${props.datum.Time}`}
      </div>
      <div style={{marginTop: '5px'}}>{props.datum.Doping}</div>
    </div>
  )
}


window.onload = function(){
  console.log('Window Loaded')
  ReactDOM.render(<App />, document.getElementById('root'))
}