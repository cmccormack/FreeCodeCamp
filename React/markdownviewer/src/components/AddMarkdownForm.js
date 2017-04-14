import React, { Component } from 'react'

class AddMarkdown extends Component {

  render() {
    return (
      <div>
        <form>
          <textarea 
              cols={50} 
              rows={20}
          >{'text'}</textarea>
        </form>
      </div>
    )
  }
}

export default AddMarkdown