import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import cx from "classnames"

import "./assets/styles/styles.scss"


class NavList extends React.PureComponent {

  static propTypes = {
    links: PropTypes.array,
    children: PropTypes.any,
    className: PropTypes.string,
  }

  static defaultProps = {
    links: [],
    className: "",
  }

  render() {
    const { children, className, links } = this.props
    return <ul className={cx(className, "navlist")}>
      {links.map(item => (
        <NavItem
          key={item.name}
          link={item.link}
          name={item.name}
          onClick={item.onClick}
        />
      ))}
      {children}
    </ul>
  }
}

class NavItem extends React.PureComponent {

  static propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    link: PropTypes.string.isRequired,
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    onClick: PropTypes.func,
  }

  static defaultProps = {
    className: "",
    onClick: undefined,
  }

  render() {
    const { children, className, link, name, onClick } = this.props
    return (
      <li className={cx(className, "navitem")}>
        <a className="navlink" href={link} onClick={onClick}>
          {name}
        </a>
        {children}
      </li>
    )
  }
}


class Header extends React.Component {

  state = {
    isVisible: false,
  }

  static propTypes = {
    badge: PropTypes.string,
  }

  static defaultProps = {
    badge: "Title",
  }

  componentDidMount() {
    document.body.addEventListener("click", () => {
      this.setState({isVisible: false})
    })
  }

  handleDropdownClick = () => {
    this.setState(prevState => ({isVisible: !prevState.isVisible}))
  }

  render() {

    const { isVisible } = this.state
    const links = [
      { name: "Portfolio", link: "https://mackville.net/" },
    ]

    const dropdownbutton = {
      name: (
        <span>
          {"Other D3 Projects "}
          <span className="caret" />
        </span>
      ),
      link: "#", onClick: this.handleDropdownClick }

    const dropdownitems = [
      {
        name: "Force Directed Graph",
        link: "https://mackville.net/d3/forcedirected/",
      },
      {
        name: "Heatmap",
        link: "https://mackville.net/d3/heatmap/",
      },
      {
        name: "GDP Bar Chart",
        link: "https://mackville.net/d3/gdpbarchart/",
      },
      {
        name: "Meteor Strikes",
        link: "https://mackville.net/d3/meteorstrikes/",
      },
      {
        name: "Scatterplot",
        link: "https://mackville.net/d3/scatterplot/",
      },
    ]

    return (
      <header className="z-depth-2">
        <nav id="header-nav">
          <div id="header-badge">
            {"D3 Choropleth Map"}
          </div>
          <div id="header-links">
            <NavList links={links}>
              <NavItem {...dropdownbutton} className="dropdown">
                {
                  isVisible && (
                    <NavList
                      className="z-depth-4"
                      links={ dropdownitems }
                    />
                  )
                }
              </NavItem>
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
      <a
        className="navlink"
        href="https://mackville.net"
      >
        {"Christopher McCormack"}
      </a>
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