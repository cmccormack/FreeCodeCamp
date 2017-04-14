import React, { Component } from 'react'

class AppHeader extends Component {

  shouldComponentUpdate() {
    return true
  }

  render() {
    return (
      <div className="app-header">
        <i className="fa fa-beer" /><span id="header-name">{'Chris McCormack'}</span>
      </div>
    )
  }
}

export default AppHeader



