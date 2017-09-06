import React from 'react'

function Tooltip(props){
  
  return (
    <div
        className='tt'
        style={{
            left: `${props.pos.x}px`,
            top: `${props.pos.y}px`,
            display: props.showTooltip ? 'block' : 'none'
        }}
    >
      <div 
          className={'tt-header text-center'}
          style={{fontWeight: 'bold'}}
      >
        {`${globals.months[props.datum.month-1]}, ${props.datum.year}`}
      </div>
      <div>{`Base Temp: ${props.datum.baseTemp}`}</div>
      <div>{`Variance: ${props.datum.variance}`}</div>
      <hr style={{margin: '0', border: '1px solid black'}} />
      <div>{`Temp: ${(props.datum.baseTemp + props.datum.variance).toFixed(2)}`}</div>
    </div>
  )
}

export default Tooltip