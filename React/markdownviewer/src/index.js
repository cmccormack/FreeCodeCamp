import React from 'react'
import ReactDOM from 'react-dom'



class MarkdownViewer extends React.Component {
  constructor() {
    super()

    this.state = {
      projects: {test: 'testing'}
    }
  }

  render() {
    return (
 
      <div>
        <AddMarkdownForm />
      </div>
    )
  }
}

class AddMarkdownForm extends React.Component {

  render() {
    return (
      <div>
        <form>
          <textarea 
            cols={50} 
            rows={20}
            defaultValue={'this.projects.test'}
          />
        </form>
      </div>
    )
  }
}




ReactDOM.render(
  <MarkdownViewer />,
  document.getElementById('root')
)