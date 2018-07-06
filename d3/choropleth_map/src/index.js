import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import cx from "classnames"

import "./assets/styles/styles.scss"

const {d3, topojson} = window

// const Bars = () => <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-prefix="fas" data-icon="bars" className="svg-inline--fa fa-bars fa-w-14" role="img" viewBox="0 0 448 512"><path fill="currentColor" d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"/></svg>
const BarChart = () => <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" data-prefix="fas" data-icon="chart-bar" className="svg-inline--fa fa-chart-bar fa-w-16" role="img" viewBox="0 0 512 512"><path fill="currentColor" d="M500 384c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v308h436zm-308-44v-72c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v72c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0V204c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v136c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm-96 0V140c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v200c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm192 0V108c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v232c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z"/></svg>

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
    component: PropTypes.string,
    id: PropTypes.string,
    link: PropTypes.string,
    name: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    onClick: PropTypes.func,
  }

  static defaultProps = {
    className: "",
    component: "a",
    id: "",
    link: null,
    onClick: null,
  }

  render() {
    const {
      children,
      className,
      component: Component,
      id,
      link,
      name,
      onClick,
    } = this.props

    return (
      <li className={cx(className, "navitem")}>
        <Component
          className="navlink"
          href={link}
          id={id}
          onClick={onClick}
          
        >
          {name}
        </Component>
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
    document.addEventListener("click", (e) => {
      !this.dropdownButton.contains(e.target) &&
      this.setState({isVisible: false})
    })
  }

  handleDropdownClick = () => {
    this.setState(prevState => ({
      isVisible: !prevState.isVisible,
    }))
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
      id: "dropdown-button",
      link: "#",
      onClick: this.handleDropdownClick,
    }

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
      <header className="z-depth-2" ref={node => this.node = node}>
        <nav id="header-nav">
          <div id="header-badge">
            <span id="header-badge-icon">
              <BarChart />
            </span>
            {"D3 Choropleth Map"}
          </div>
          <div id="header-links" >
            <NavList links={links}>
              <span
                id="dropdown-wrapper" 
                ref={node => this.dropdownButton = node}
              >
                <NavItem
                  {...dropdownbutton}
                  className="dropdown"
                  component="span"
                >
                  {
                    isVisible && (
                      <NavList
                        className="z-depth-4"
                        links={ dropdownitems }
                      />
                    )
                  }
                </NavItem>
              </span>
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

  static propTypes = {
    canvas: PropTypes.object,
    data: PropTypes.object,
    height: PropTypes.number,
    width: PropTypes.number,
    padding: PropTypes.number,
  }

  static defaultProps = {
    canvas: { width: 1024, height: 600, padding: 30 },
    data: {
      us: {},
      education: [],
    },
  }

  state = {

  }

  componentDidUpdate() {
    // this.renderD3()
    return this.props.data && this.renderD3()
  }

  renderD3() {

    const { data } = this.props
    const { us, education } = data
    const steps = 8

    const [min, max] = d3.extent(education, d=>d.bachelorsOrHigher)
    const edu_map = d3.map(education, d => d.fips)

    const colorScale = d3.scaleThreshold()
      .domain(d3.range(Math.floor(min), Math.ceil(max), (max-min)/steps))
      .range(d3.schemeOranges[9])

    const svg = d3.select(this.svg)

    const path = d3.geoPath()
    
    svg.append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .enter().append("path")
      .attr("fill", d => colorScale( d.percent = edu_map.get(d.id).bachelorsOrHigher ))
      .attr("d", path )
      .attr("class", "county")
      .attr("data-fips", d => d.id)
      .attr("data-education", d => edu_map.get(d.id).bachelorsOrHigher)
      .append("title")
      .text(d => `${d.percent}%`)

    svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b }))
      .attr("class", "states")
      .attr("d", path)

  }

  render() {

    const { canvas } = this.props
    const { width, height, padding } = canvas
    return (
      <main>
        <div id="title">
          {"Choropleth Map"}
        </div>
        <div id="description">
          {"Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"}
        </div>
        <div
          id="canvas"
          className="z-depth-3"
          ref={ node => this.canvas = node }
        >
          <svg
            width={width}
            height={height}
            ref={ node => this.svg = node}
          >
            
          </svg>
        </div>
      </main>
    )
  }
}



class App extends React.Component {

  static propTypes = {
    data: PropTypes.object,
    data_urls: PropTypes.object,
    canvas: PropTypes.object,
  }

  state = {
    data: {},
  }

  async componentDidMount() {

    // Fetch data from urls and store in array of objects
    const {data_urls} = this.props.data
    const [education, us] = await Promise.all(
      data_urls
        .map(({url})=>fetch(url)
          .then(data=> (data.json()))
        ))
    this.setState({data: { education, us }})
  }

  render() {
  
    const { canvas } = this.props.data
    const { data } = this.state

    return (
      <React.Fragment>
        <Header />
        <Main data={data} canvas={canvas} />
        <Footer />
      </React.Fragment>
    )
  }
}

const globals = {
  data_urls: [
    {
      name: "education",
      url: "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json",
    },
    {
      name: "us",
      url: "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json",
    },
  ],
  canvas: {
    width: 960,
    height: 600,
    padding: 30,
  },
}

const root = document.getElementById("root")
ReactDOM.render(
  <App data={globals} />,
  root
)
