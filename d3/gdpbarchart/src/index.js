/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
import { scaleTime, scaleLinear } from 'd3-scale'


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
        console.log(json)
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

  var canvas = {
      className: 'canvas',
      width: 900,
      height: 600,
      style: {
        backgroundColor: '#EEE',
        boxShadow: '-8px 8px 32px #444'
      }
    }

  console.log(props.data ? props.data : 'No Data')
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
  console.log(props.data)
  var chart = {
    marginTop: 40,
    marginRight: 40,
    marginBottom: 40,
    marginLeft: 40,
  },
  data = props.data,
  barWidth = 0,
  x = scaleTime().domain([new Date(data[0][0]), new Date(data[data.length-1][0])]).nice(),
  y = scaleLinear().domain([data[data.length - 1][1],0]),
  color = scaleLinear().domain([0, data[data.length-1][1]]).range([190, 230])
    
  chart.width = props.canvas.width - chart.marginLeft - chart.marginRight
  chart.height = props.canvas.height - chart.marginTop - chart.marginBottom
  chart.x = chart.marginLeft
  chart.y = props.canvas.height - chart.marginBottom

  x.range([chart.x, chart.width])
  y.range([chart.height, 0])
  barWidth = chart.width / data.length
  console.log(`chart.x: ${chart.x}, chart.y: ${chart.y}, chart.width: ${chart.width}, chart.height: ${chart.height}`)

  return (
    <g>
      {data.map((v,i)=>{
        console.log(`value: ${v[1]}, scaleLinear: ${y(v[1])}`)
        return (
          <rect 
              fill={`hsl(${color(v[1])}, 50%, 50%)`}
              height={`${ y(v[1]) }px`}
              key={v[0]+v[1]}
              width={`${barWidth}px`}
              x={chart.x + (i*barWidth)}
              y={chart.y - y(v[1])}
          />)
      })}
    </g>
  )
}


window.onload = function(){
  console.log('Window Loaded')
  ReactDOM.render(<App />, document.getElementById('root'))
}