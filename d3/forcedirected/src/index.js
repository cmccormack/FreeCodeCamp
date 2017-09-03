/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'

import { Header, Footer} from './components/Layout/layout'

import './styles/app.scss'
// import 'bootstrap/dist/css/bootstrap.css'

window.onload = function(){
  console.log('Window Loaded')
  ReactDOM.render(<App />, document.getElementById('root'))
}

var globals = {
  url: 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json'
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  componentWillMount(){
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
          description: 'Bouncy Flags!!!!',
          title: 'National Contiguity using D3 Force Directed Graph'
        }, ()=>{console.log(this.state.data)}) 
      })
  }

  componentDidMount(){
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
        <Header 
            brand={'Chris McCormack'}
            icon={{icon:'fa fa-lg fa-fw fa fa-bar-chart', height: '0.7'}}
            url={'https://mackville.net'}
        />
        <TitleBar title={this.state.title} />
        <CanvasBody 
            data={this.state.data}
            desc={this.state.description}
        />
        
        <div style={{width: '100px', height: '800px', backgroundColor: 'pink'}} />
        <Footer />
      </div>
    )
  }
}

function TitleBar(props){
  return <div className='title display-5 text-center text-shadow unselectable'>{props.title}</div>
}

function CanvasBody(props){
  console.log('In CanvasBody Componenet')
  console.log(props)
  var canvas = {
      className: 'canvas',
      width: 900,
      height: 600
    }

  return (
    <svg {...canvas}>
      <text 
          className={'display-5'}
          x={300}
          y={50}
      >
        {props.desc}
      </text>
    </svg>
  )
}





// class Circle extends React.Component {

//   constructor(props){
//     super(props)

    
//     this.highlightColor = `hsl(${this.props.color}, 80%, 60%)`
//     this.fillColor = `hsl(${this.props.color}, 80%, 40%)`
//     const {cx, cy, r, className} = props
//     this.attr = {cx, cy, r, className}

//     this.state = {
//       fill: this.fillColor,
//       fontSize: 10,
//       tag: {
//         marginLeft: 10,
//         marginTop: 4
//       }

//     }
//     this.handleMouseOver = this.handleMouseOver.bind(this)
//     this.handleMouseOut = this.handleMouseOut.bind(this)
//   }

//   shouldComponentUpdate(nextProps, nextState){
//     return this.props === nextProps && this.state===nextState ? false : true
//   }

//   handleMouseOver(){
//     let props = {showTooltip: true, datum:this.props.datum}
//     ReactDOM.render(<Tooltip {...props} />, document.getElementById('tooltip'))
//     this.setState({fill: this.highlightColor})
//   }

//   handleMouseOut(){
//     this.setState({fill: this.fillColor})
//   }

//   buildToolTip(){

//   }

//   render (){
//     return (
//       <g>
//         <circle 
//             {...this.attr}
//             className={'circle'}
//             fill={this.state.fill}
//             onMouseOut={this.handleMouseOut}
//             onMouseOver={this.handleMouseOver}
//         />
//         <text
//             fontSize={this.state.fontSize}
//             onMouseOut={this.handleMouseOut}
//             onMouseOver={this.handleMouseOver}
//             x={this.props.cx + this.state.tag.marginLeft}
//             y={this.props.cy + this.state.tag.marginTop}
//         >
//           {this.props.datum.Name}
//         </text>
//       </g>
//     )
//   }
// }


// function Tooltip(props){

//   return (
//     <div 
//         className='tt'
//         style={{
//           left: 150,
//           top: 150,
//           display: props.showTooltip ? 'block' : 'none',
//           fontSize: '12px'
//         }}
//     >
//       <div>
//         <a 
//             href={props.datum.URL}
//             style={{fontWeight: 600}}
//             target={'_blank'}
//         >
//           {props.datum.Name}
//         </a>
//         {' - '}
//         {props.datum.Nationality}
//       </div>
//       <div>
//         {`${props.datum.Year}, Place: ${props.datum.Place}, Time: ${props.datum.Time}`}
//       </div>
//       <div style={{marginTop: '5px'}}>{props.datum.Doping}</div>
//     </div>
//   )
// }


