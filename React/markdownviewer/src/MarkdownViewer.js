import React, { Component } from 'react'
import './styles/app.css'
import AddMarkdownForm from './components/AddMarkdownForm'

class MarkdownViewer extends Component {
  constructor() {
    super()

    this.state = {
      projects: {test: 'testing'}
    }
  }

  // Always called before the render method and enables to define if a
  // re-rendering is needed or can be skipped. Boolean value must be returned.
  shouldComponentUpdate() {
    return true
  }


  render() {
    return (
 
      <div className="app">
        <div className="app-wrapper">
          <div className="app-nav" />
          <div className="main-content">
            <AddMarkdownForm />
          </div>
        </div>
      </div>
    )
  }
}

export default MarkdownViewer



