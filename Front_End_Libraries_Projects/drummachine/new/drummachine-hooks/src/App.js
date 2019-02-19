import React, { useEffect, useState, useRef, createContext, useContext } from 'react';

import './App.scss'

const StoreContext = createContext('');
const StoreProvider = ({ value, children }) => {

  const [played, setPlayed] = useState(value.played)

  return (
    <StoreContext.Provider
      value={{
        drums: value.drums,
        played,
        setPlayed,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

const Title = ({ children }) => <div id="title">{children}</div>

const Drum = ({ keyTrigger, url, id }) => {

  const { setPlayed } = useContext(StoreContext)

  const [active, isActive] = useState(false)
  const audioEl = useRef(null)

  const playAudio = () => {
    audioEl.current.currentTime = 0
    audioEl.current.play()
    setPlayed(id)
    isActive(true)
    setTimeout(() => { isActive(false) }, 100)
  }

  const keydownAction = e => e.key.toUpperCase() == keyTrigger && playAudio()

  useEffect(() => {
    document.addEventListener('keydown', keydownAction)
    return () => document.removeEventListener('keydown', keydownAction)
  }, [])

  return (
    <div
      className={`drum-pad ${active ? 'active' : ''}`}
      id={keyTrigger}
      onClick={playAudio}
    >
      <audio className={'clip'} id={keyTrigger} ref={audioEl} src={url} />
      {keyTrigger}
    </div>
  )
}

const Display = () => {
  const context = useContext(StoreContext)
  return (
    <div id="display">
      <div id="display-screen">{context.played}</div>
    </div>
  )
}

const Drums = () => {
  const { drums } = useContext(StoreContext)

  return (
    <div id="drums">
      {drums.map(drum =>
        <Drum key={drum.keyTrigger} {...drum} />)
      }
    </div>
  )
}

const App = ({ drums }) => {

  return (
    <React.Fragment>
      <StoreProvider value={{ drums, played: '--' }}>
        <header>
          <Title>Drum Machine</Title>
        </header>
        <main>
          <Display />
          <Drums />
        </main>
      </StoreProvider>
    </React.Fragment>
  )
}

export default App;
