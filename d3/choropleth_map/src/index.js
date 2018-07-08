import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import cx from "classnames"

import "./assets/styles/styles.scss"

const {d3, topojson} = window

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

const ToolTip = props => {

  const {children, x, y, offsetX, offsetY, visible} = props
  // console.log(rest)
  return (
    <div
      id="tooltip"
      style={{
        left: x + offsetX,
        top: y + offsetY,
        display: visible ? "inline-block" : "none",
      }}
      data-education={props["data-education"] || "0%"}
    >
      {children}
    </div>
  )
}

ToolTip.propTypes = {
  children: PropTypes.any,
  "data-education": PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  x: PropTypes.number,
  y: PropTypes.number,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  visible: PropTypes.bool,
}

ToolTip.defaultProps = {
  children: "tooltip",
  "data-education": "0%",
  x: 0,
  y: 0,
  offsetX: 0,
  offsetY: 0,
  visible: false,
}


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
    return this.props.data && this.renderD3()
  }


  renderD3() {

    const { data } = this.props
    const { us, education } = data
    const steps = 8

    const [min, max] = d3.extent(education, d => d.bachelorsOrHigher)
    const edu_map = d3.map(education, d => d.fips)

    const colorScale = d3.scaleThreshold()
      .domain(d3.range(Math.floor(min), Math.ceil(max), (max - min) / steps))
      .range(d3.schemeOranges[9])


    this.renderD3Map(colorScale, us, edu_map)
    this.renderD3Legend(colorScale, {min, max})
  }


  renderD3Map(color, geo, data) {

    const svg = d3.select(this.svg)

    const path = d3.geoPath()
    
    svg.append("g")
      .attr("class", "counties")
      .selectAll("path")
      .data(topojson.feature(geo, geo.objects.counties).features)
      .enter().append("path")
      .attr("fill", d => color( d.percent = data.get(d.id).bachelorsOrHigher ))
      .attr("d", path )
      .attr("class", "county")
      .attr("data-fips", d => d.id)
      .attr("data-education", d => data.get(d.id).bachelorsOrHigher)
      .on("mouseover", d => {
        const {state, area_name, bachelorsOrHigher: rate} = data.get(d.id)
        const [x, y] = [d3.event.pageX, d3.event.pageY]
        ReactDOM.render(
          <ToolTip
            data-education={rate}
            x={x}
            y={y}
            offsetX={10}
            offsetY={-30}
            visible
          >
            {`${area_name}, ${state}: ${rate}%`}
          </ToolTip>,
          tooltipdiv
        )
      })
      .on("mouseout", () => {
        ReactDOM.render(<ToolTip />, tooltipdiv)
      })
      .append("title")
      .text(d => `${d.percent}%`)

    svg.append("path")
      .datum(topojson.mesh(geo, geo.objects.states, (a,b) => a !== b ))
      .attr("class", "states")
      .attr("d", path)
  }


  renderD3Legend(color, {min, max}) {

    const svg = d3.select(this.svg)

    const x = d3.scaleLinear()
      .domain([Math.floor(min), Math.ceil(max)])
      .rangeRound([600, 860])

    const g = svg.append("g")
      .attr("class", "key")
      .attr("id", "legend")
      .attr("transform", "translate(0, 42)")

    g.selectAll("rect")
      .data(color.range().map(d => {
        d = color.invertExtent(d)
        d[0] = d[0] || x.domain()[0]
        d[1] = d[1] || x.domain()[1]
        return d
      }))
      .enter().append("rect")
      .attr("height", 8)
      .attr("x", d => x(d[0]))
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("fill", d => color(d[0]))

    g.append("text")
      .attr("class", "caption")
      .attr("x", x.range()[0])
      .attr("y", -6)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Rate of Bachelor's Degree or Higher")

    g.call(d3.axisBottom(x)
      .tickSize(13)
      .tickFormat((x, i) => i ? Math.ceil(x) : Math.ceil(x) + "%")
      .tickValues(color.domain()))
      .select(".domain")
      .remove()
  }


  render() {

    const { canvas } = this.props
    const { width, height } = canvas
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

const tooltipdiv = document.getElementById("tt")
ReactDOM.render(
  <ToolTip/>,
  tooltipdiv
)