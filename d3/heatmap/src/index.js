/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
import { scaleTime, scaleLinear, scaleOrdinal, scaleBand} from 'd3-scale'
import { axisBottom, axisLeft } from 'd3-axis'
import { timeYear } from 'd3-time'
import { select } from 'd3-selection'
import { timeFormat } from 'd3-time-format'
import { extent} from 'd3-array'



var globals = {
  url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: [{
        year: 0,
        month: 1,
        variance: 0
      }],
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
          data: json.monthlyVariance,
          baseTemp: json.baseTemperature,
          description: 'Doping in Professional Bicycle Racing',
          title: 'D3 Monthly Global Land-Surface Temperature'
        })
      })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props === nextProps && this.state===nextState ? false : true
  }

  handleTooltip(showTooltip, datum) {
    this.setState({
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
      marginLeft: 100,
      xAxis: {
        marginLeft: 15,
        marginRight: 150
      },
    },
    data = props.data.map((v)=>{
      v.date = new Date(v.year, 0)
      return v
    }),
    years = Array.from(new Set(data.map((v)=>v.year))),
    bar,
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ]


  chart.xScale = scaleTime().domain(extent(data, (v)=>v.year))
  chart.xScale.ticks(timeYear.every(1))
  chart.yScale = scaleBand().domain(months)

  chart.width = props.canvas.width - chart.marginLeft - chart.marginRight
  chart.height = props.canvas.height - chart.marginTop - chart.marginBottom
  chart.x = chart.marginLeft
  chart.y = props.canvas.height - chart.marginBottom

  bar = {
    width: chart.width / Array.from(new Set(years)).length,
    height: chart.height / months.length
  }

  chart.xScale.range([chart.x, chart.width + chart.x])
  chart.yScale.range([chart.marginTop, chart.height+chart.marginTop])

  var xAxis = axisBottom(chart.xScale).tickFormat(timeFormat('%Y')),
    yAxis = axisLeft(chart.yScale)

  var x = 0

  select('.canvas').append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${chart.y})`)
    .call(xAxis)
  
  select('.canvas').append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${chart.x}, ${0})`)
    .call(yAxis)

  return (
    <g>
      {data.map((v,i)=>{
        x += (i + 1) % 12 === 0 ? 1 : 0
        return (
          <Rect
              className={'rect'}
              color={Math.floor(Math.random()*360)}
              datum={v}
              handleMouse={props.handleMouse}
              height={bar.height}
              key={`${v.month}${v.year}`}
              width={bar.width}
              x={x * bar.width + chart.marginLeft}
              y={((i % 12) * bar.height) + chart.marginTop}
          />
        )
      })}
    </g>
  )
}


class Rect extends React.Component {

  constructor(props){
    super(props)

    
    this.highlightColor = `hsl(${this.props.color}, 80%, 60%)`
    this.fillColor = `hsl(${this.props.color}, 50%, 50%)`
    const {x, y, height, width, className} = props
    this.attr = {x, y, height, width, className}

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
    this.props.handleMouse(true, this.props.datum)
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

  return (
    <div 
        className='tt'
        style={{
          left: 150,
          top: 150,
          display: props.display ? 'block' : 'none',
          fontSize: '12px'
        }}
    >
      <div>
        <a 
            href={props.datum.URL}
            style={{fontWeight: 600}}
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

