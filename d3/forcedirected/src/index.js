/*eslint no-console: "off"*/

import './styles/app.scss'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './containers/App'

window.onload = function(){
  console.log('Window Loaded')
  ReactDOM.render(<App url={globals.url} />, document.getElementById('root'))
}

var globals = {
  url: 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json'
}