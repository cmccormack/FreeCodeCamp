/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'
import { scaleTime, scaleLinear } from 'd3-scale'
import { d3 } from 'd3'


var globals = {
  url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
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
    // Grab data from API and store in state once App mounts
    fetch(globals.url)
      .then((response)=>response.json()).then(json=>{
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
        <ChartBody 
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

function ChartBody(props){

  var canvas = {
      className: 'canvas',
      width: 900,
      height: 600,
      style: {
        backgroundColor: '#EEE',
        boxShadow: '-8px 8px 32px #444'
      }
    },
    chart = {
      marginTop: 40,
      marginRight: 40,
      marginBottom: 40,
      marginLeft: 40,
    },
    data = props.data,
    barWidth = 0,
    x = scaleTime().domain([new Date(data[0]), new Date(data[1])]),
    y = scaleLinear().range([chart.height, 0])
    
    
  chart.width = canvas.width - chart.marginLeft - chart.marginRight
  chart.height = canvas.height - chart.marginTop - chart.marginBottom
  chart.x = chart.marginLeft
  chart.y = canvas.height - chart.marginBottom

  y.range([0, chart.height])
  barWidth = chart.width / data.length

  console.log(x)
  console.log(y)

  return (
    <svg {...canvas} >
      {data.map((v,i)=>{
        console.log(v[1])
        console.log(y(v[1]))
        return (
          <rect 
              height={`${ y(v[1]) }px`}
              key={v[0]+v[1]}
              width={`${barWidth}px`}
              x={chart.x + (i*barWidth)}
              y={chart.y - v[1]/20}
          />)
      })}
    </svg>
  )
}

window.onload = function(){
  ReactDOM.render(<App />, document.getElementById('root'))
}