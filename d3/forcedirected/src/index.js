/*eslint no-console: "off"*/

import React from 'react'
import ReactDOM from 'react-dom'

import App from './containers/App'

import './styles/app.scss'

window.onload = function(){
  console.log('Window Loaded')
  ReactDOM.render(<App url={globals.url} />, document.getElementById('root'))
}

var globals = {
  url: 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json'
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


