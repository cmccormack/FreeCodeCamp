/*eslint no-console: "off"*/

import React from 'react'
// import 'bootstrap-sass'

function CanvasBody(props){
  console.log('In CanvasBody Componenet')

  var canvas = {
      className: 'canvas',
      width: props.width,
      height: props.height
    }

  return (
    <svg {...canvas}>
      <text 
          className={'display-1 text-shadow'}
          x={300}
          y={50}
      >
        {props.desc}
      </text>
    </svg>
  )
}

export default CanvasBody