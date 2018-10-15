import React from 'react'
import ReactDOM from 'react-dom'

import './images/favicon.ico'
import './styles/styles.scss'

const drums = [
  {
    keyCode: 81,
    keyTrigger: "Q",
    id: "Heater-1",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"
  },
  {
    keyCode: 87,
    keyTrigger: "W",
    id: "Heater-2",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"
  },
  {
    keyCode: 69,
    keyTrigger: "E",
    id: "Heater-3",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"
  },
  {
    keyCode: 65,
    keyTrigger: "A",
    id: "Heater-4",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
  },
  {
    keyCode: 83,
    keyTrigger: "S",
    id: "Clap",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"
  },
  {
    keyCode: 68,
    keyTrigger: "D",
    id: "Open-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
  },
  {
    keyCode: 90,
    keyTrigger: "Z",
    id: "Kick-n'-Hat",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"
  },
  {
    keyCode: 88,
    keyTrigger: "X",
    id: "Kick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"
  },
  {
    keyCode: 67,
    keyTrigger: "C",
    id: "Closed-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
  }
]

const Title = ({children}) => <div id="title">{children}</div>

class Drum extends React.Component {
  
  state = {
    active: false,
  }

  audioRef = React.createRef()

  componentDidMount() {
    
    document.addEventListener('keydown', e => {
      if (e.key.toUpperCase() == this.props.keyTrigger) {
        this.playAudio()
      }
    })
  }

  playAudio = () => {
    this.audioRef.current.currentTime = 0
    this.audioRef.current.play()
    this.props.handlePlayed(this.props.id)
    setTimeout(() => this.setState({active: false}), 100)
    this.setState({active: true})
  }

  render() {
    const { id, keyTrigger, url} = this.props
    const { active } = this.state
    
    return (
      <div
        className={`drum-pad ${active ? 'active' : ''}`}
        id={keyTrigger}
        onClick={this.playAudio}
      >
        <audio
          className={'clip'}
          id={keyTrigger}
          ref={this.audioRef}
          src={url}
        />
        {keyTrigger}
      </div>
    )
  }
}

class App extends React.Component {
  
  state = {
    played: "--"
  }

  handlePlayed = (drum) => {
    this.setState({ played: drum })
  }

  render() {
    
    const { played } = this.state
    const { drums } = this.props
    
    return (
      <React.Fragment>
        <header>
          <Title>Drum Machine</Title>
        </header>
        <main>
          <div id="display">
            <div id="display-screen">{played}</div>
          </div>
          <div id="drums">
            { drums.map(drum => (
                <Drum
                  key={drum.keyTrigger}
                  handlePlayed={this.handlePlayed}
                  {...drum}
                />
            ))}
          </div>
        </main>
      </React.Fragment>
    )
  }
}

let urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('test')) {
  const fccTestingScript = document.createElement('script')
  fccTestingScript.src = 'https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js'
  document.head.appendChild(fccTestingScript);
}

ReactDOM.render(<App drums={drums} />, document.getElementById("drum-machine"))
