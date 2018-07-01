import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

import "./assets/styles/styles.scss"


class NavList extends React.PureComponent {

  static propTypes = {
    children: PropTypes.array,
  }

  static defaultProps = {
    children: [],
  }

  render() {
    const { children } = this.props
    return (
      <ul className="navlist">
        {
          children.map(item => (
            <NavItem
              key={item.name}
              link={item.link}
              name={item.name}
              onClick={item.onClick}
            />
          ))
        }
      </ul>
    )
  }
}

class NavItem extends React.PureComponent {
  static propTypes = {
    link: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
  }

  static defaultProps = {
    onClick: undefined,
  }

  render() {
    const { link, name, onClick } = this.props
    return (
      <li className="navitem">
        <a
          className="navlink"
          href={link}
          onClick={onClick}
        >
          {name}
        </a>
      </li>
    )
  }
}


class Header extends React.Component {

  static propTypes = {
    badge: PropTypes.string,
  }

  static defaultProps = {
    badge: "Title",
  }

  render() {

    const links = [
      { name: "Portfolio", link: "https://mackville.net/" },
    ]
    return (
      <header className="z-depth-2">
        <nav id="header-nav">
          <div id="header-badge">
            {"D3 Choropleth Map"}
          </div>
          <div id="header-links">
            <NavList>
              {links}
            </NavList>
          </div>
        </nav>
      </header>
    )
  }
}

const Footer = () => (
  <footer>
    <span id="created-by">Created By&nbsp;</span>
    <span>
      <a className="navlink" href="https://mackville.net">Christopher McCormack</a>
    </span>
  </footer>
)

class Main extends React.Component {
  state = {

  }

  render() {
    return (
      <main>
        main
      </main>
    )
  }
}

class App extends React.Component {

  state = {

  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <Main />
        <Footer />
      </React.Fragment>
    )
  }
}


const root = document.getElementById("root")
ReactDOM.render(
  <App />,
  root
)