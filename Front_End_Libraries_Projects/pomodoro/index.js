import React from "react"
import ReactDOM from "react-dom"

const MINTIME = 1
const MAXTIME = 60 * 60

const getTimeArray = (seconds) => [Math.floor(seconds / 60), seconds % 60]

const getClockTime = (seconds) => 
  getTimeArray(seconds).map(v => String(v).padStart(2,"0")).join(":")


class AccurateInterval {

  intervalId = null

  constructor(fn, timer) {
    this.fn = fn
    this.timer = timer
  }

  start = () => {
    this.next = new Date().getTime() + this.timer
    this.step()
    return this
  }

  step = () => {
    this.next += this.timer
    this.intervalId = setTimeout(() => {
      this.step()
      this.fn()
    },
    this.next - new Date().getTime())
  }

  stop = () => {
    clearTimeout(this.intervalId)
  }

}


const Header = ({ title }) => (
  <header>
    <div id="title">{title}</div>
  </header>
)

const Main = ({ children }) => <main>{children}</main>

const Display = (props) => {

  const { timeRemaining, sessionTimer, breakTimer, timerPhase } = props

  return (
    <div id="display">
      <div id="timer-label">{timerPhase}</div>
      <div id="time-left">{getClockTime(timeRemaining)}</div>
      <div id="lengths">
        <div id="session-label">
          {"Session Length: "}
          <span id="session-length">{getTimeArray(sessionTimer)[0]}</span>
          {" Min"}
        </div>
        <div id="break-label">
          {"Break Length: "}
          <span id="break-length">{getTimeArray(breakTimer)[0]}</span>
          {" Min"}
        </div>
      </div>
    </div>
  )
}

const Buttons = (props) => {
  const { adjustTimer, startStop, reset, disableButtons, running } = props
  return <div id="buttons">

    {/* Timer Adjustment Buttons */}
    <div id="timer-adjustments" className="button_section">
      <div className="adjustment">
        <button
          id="session-increment"
          className="btn btn-adjust"
          disabled={disableButtons}
          type="button"
          onClick={adjustTimer}
          data-target="sessionTimer"
          data-adjust="+1">
          {"+"}
        </button>
        <span id="session-adjust-label" className="adjust-label">
            Session Time
        </span>
        <button
          id="session-decrement"
          className="btn btn-adjust"
          disabled={disableButtons}
          type="button"
          onClick={adjustTimer}
          data-target="sessionTimer"
          data-adjust="-1">
          {"-"}
        </button>
      </div>
      <div className="adjustment">
        <button 
          id="break-increment"
          className="btn btn-adjust"
          disabled={disableButtons}
          type="button"
          onClick={adjustTimer}
          data-target="breakTimer"
          data-adjust="+1">
          {"+"}
        </button>
        <span
          id="break-adjust-label"
          className="adjust-label">
          {"Break Time"}
        </span>
        <button
          id="break-decrement"
          className="btn btn-adjust"
          disabled={disableButtons}
          type="button"
          onClick={adjustTimer}
          data-target="breakTimer"
          data-adjust="-1">
          {"-"}
        </button>
      </div>
    </div>

    {/* Playback Buttons */}
    <div id="playback_buttons" className="button_section">
      <button id="start_stop" className="btn btn-playback" onClick={startStop}>
        {running ? "Stop" : "Start"}
      </button>
      <button id="reset" className="btn btn-playback" onClick={reset}>
          Reset
      </button>
    </div>
  </div>
}

class App extends React.Component {

  state = {
    timeRemaining: this.props.defaultSession,
    sessionTimer: this.props.defaultSession,
    breakTimer: this.props.defaultBreak,
    timerPhase: this.props.defaultPhase,
    intervalId: 0,
    intervalLength: 10,
    disableButtons: false,
    running: false,
  }


  adjustTimer = e => {
    const { adjust, target } = e.target.dataset
    const newTimer = this.state[target] + Number(adjust) * 60
    if (newTimer < MINTIME || newTimer > MAXTIME) return
    if (target === "breakTimer") return this.setState({
      breakTimer: newTimer,
    })
    this.setState({
      sessionTimer: newTimer,
      timeRemaining: newTimer,
    })
  }

  toggleRunning = async () => this.setState(prevState => ({
    running: !prevState.running,
    disableButtons: true,
  }))

  timerInterval = () => {
    const { timerPhase, sessionTimer, breakTimer, timeRemaining} = this.state
    if (timeRemaining <= 0) {
      this.promise = this.alarm.play()
      this.setState({
        timeRemaining: timerPhase === "Session" ? breakTimer : sessionTimer,
        timerPhase: timerPhase === "Session" ? "Break" : "Session",
      })
    }
    else {
      this.setState(prevState => ({
        timeRemaining: prevState.timeRemaining - 1,
      }))
    }
  }


  startStop = async () => {
    const { intervalLength, intervalId, running } = this.state

    intervalId && running && intervalId.stop()

    this.setState(prevState => ({
      intervalId: prevState.running 
        ? prevState.intervalId 
        : new AccurateInterval(this.timerInterval, intervalLength).start(),
      running: !prevState.running,
      disableButtons: true,
    }))
  }


  reset = () => {
    const { defaultBreak, defaultSession, defaultPhase } = this.props
    const { intervalId } = this.state

    intervalId && intervalId.stop()


    this.alarm.pause()
    this.alarm.currentTime = 0

    this.setState({
      running: false,
      disableButtons: false,
      breakTimer: defaultBreak,
      sessionTimer: defaultSession,
      timeRemaining: defaultSession,
      timerPhase: defaultPhase,
    })
  }


  render() {

    const {
      timeRemaining,
      sessionTimer,
      breakTimer,
      timerPhase,
      running,
      disableButtons,
    } = this.state

    return (
      <React.Fragment>
        <Header title="Pomodoro Clock" />
        <Main>
          <Display
            breakTimer={breakTimer}
            sessionTimer={sessionTimer}
            timeRemaining={timeRemaining}
            timerPhase={timerPhase} />
          <Buttons
            adjustTimer={this.adjustTimer}
            disableButtons={disableButtons}
            running={running}
            startStop={this.startStop}
            reset={this.reset} />
          <audio id="beep" ref={node => this.alarm = node}>
            <source src="https://mackville.net/pomodoro/sounds/session-start.mp3" type="audio/mp3" />
          </audio>
        </Main>
      </React.Fragment>
    )
  }
}


ReactDOM.render(
  <App
    defaultSession={25 * 60}
    defaultBreak={5 * 60}
    defaultPhase="Session"
  />,
  document.getElementById("root")
)
