import React from 'react'

function Tooltip(props){
  
  if (props.hasOwnProperty('pos')){
    var {x, y} = props.pos
  } else {
    [x, y] = [0,0]
  }

  return (
    <div
        className='tt'
        style={{
            left: `${x}px`,
            top: `${y}px`,
            display: props.showTooltip ? 'block' : 'none'
        }}
    >
      {props.children}
    </div>
  )
}

export default Tooltip