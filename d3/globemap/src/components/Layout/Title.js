import React from 'react'

function Title(props){
  const style = {
    textAlign: props.align,
    textShadow: props.shadow || 'none'
  }
  return (
    <div 
        className={`title display-${props.size} unselectable`}
        style={style}
    >
      {props.children}
    </div>
  )
}

export default Title