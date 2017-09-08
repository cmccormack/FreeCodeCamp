/*eslint no-console: "off"*/

import './styles/app.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

window.onload = function(){
  console.log('Window Loaded')
  ReactDOM.render(<App url={globals.url} />, document.getElementById('root'))
}

var globals = {
  url: {
    meteorites: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json',
    worldMap: 'https://mackville.net/d3/globemap/world-110m2.json'
  }
}