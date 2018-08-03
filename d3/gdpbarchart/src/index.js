import React from 'react'
import ReactDOM from 'react-dom'

const d3 = window.d3


const globals = {
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
    // Seed #tooltip with data for testing
    this.handleTooltip(false, {x:0,y:0}, [Date.now(), 0])

    // Grab data from API and store in state once App mounts
    fetch(globals.url)
      .then(response => response.json())
      .then(json => {
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
    const props = {showTooltip, pos, datum}
    ReactDOM.render(<Tooltip {...props} />, document.getElementById('tt'))
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
  return (
    <div
        className='title display-2 text-center text-shadow unselectable'
        id="title"
    >
      {props.title}
    </div>
  )
}

function CanvasBody(props){

  const canvas = {
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
  const chart = {
    marginTop: 40,
    marginRight: 50,
    marginBottom: 50,
    marginLeft: 70,
  }
  chart.width = props.canvas.width - chart.marginLeft - chart.marginRight
  chart.height = props.canvas.height - chart.marginTop - chart.marginBottom

  chart.x0 = chart.marginLeft
  chart.y0 = chart.marginTop
  chart.x1 = chart.marginLeft + chart.width
  chart.y1 = chart.marginTop + chart.height
  
  const { data } = props

  const [dates, gdp] = [data.map(v => new Date(v[0])), data.map(v => v[1])]

  chart.xScale = d3.scaleTime()
    .domain(d3.extent(dates))
    .range([0, chart.width])

  chart.yScale = d3.scaleLinear()
    .domain([0, d3.max(gdp)])
    .range([0, chart.height])

  chart.yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(gdp)])
    .range([chart.height, 0])

  chart.color = d3.scaleLinear()
    .domain([0, d3.max(gdp)])
    .range([230, 180])

  const xAxis = d3.axisBottom(chart.xScale).ticks(d3.timeYear.every(5))
  const yAxis = d3.axisLeft(chart.yAxisScale)
  const yaxisRight = d3.axisRight(chart.yAxisScale)

  d3.select('.canvas').append('g')
    .attr('class', 'x axis')
    .attr('id', 'x-axis')
    .attr('transform', `translate(${chart.x0}, ${chart.y1})`)
    .call(xAxis)
  
  d3.select('.canvas').append('g')
    .attr('class', 'y axis')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${chart.x0}, ${chart.y0})`)
    .call(yAxis)

  d3.select('.canvas').append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${chart.x1}, ${chart.y0})`)
    .call(yaxisRight)
  
  return (
    <g>
      {data.map((v,i)=>{
        return (
          <Rect
              datum={v}
              fill={Math.floor(chart.color(v[1]))}
              handleMouse={props.handleMouse}
              height={chart.yScale(v[1])}
              key={v[0]+v[1]}
              translateX={chart.x0}
              translateY={chart.y0}
              width={chart.width / data.length + 1}
              x={(i * (chart.width / data.length))}
              y={chart.height - chart.yScale(v[1])}
          />
        )
      })}
      <text 
          transform={'translate(-530, 500), rotate(-90)'}
          x={chart.marginLeft}
          y={chart.y0}
      >
        {'US Gross Domestic Product (in billions)'}
      </text>
      <text 
          transform={'translate(350, 45)'}
          x={chart.marginLeft}
          y={chart.y1}
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
    const [date, gdp] = this.props.datum
    const {translateX, translateY} = this.props
    return (
      <g>
        <rect
            className="bar"
            data-date={date}
            data-gdp={gdp}
            {...this.attr}
            fill={this.state.fill}
            onMouseOut={this.handleMouseOut}
            onMouseOver={this.handleMouseOver}
            transform={`translate(${translateX}, ${translateY})`}
        />
      </g>
      
    )
  }
}

function Tooltip(props){

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  let date = new Date(props.datum[0]),
    year = date.getFullYear(),
    month = months[date.getMonth()]

  

  return (
    <div 
        data-date={props.datum[0]}
        id="tooltip"
        style={{
          left: props.pos.x-210,
          top: props.pos.y-70,
          display: props.showTooltip ? 'block' : 'none'
        }}
    >
      <div style={{fontWeight: 600}}>
        {`${d3.format('$,.2f')(props.datum[1])} Billion`}
      </div>
      <div>
        {`${month} ${year}`}
      </div>
    </div>
  )
}



ReactDOM.render(<App />, document.getElementById('root'))
