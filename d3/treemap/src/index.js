import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"

import "./assets/styles/styles.scss"

const {d3} = window

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
    return <ul className={className + " navlist"}>
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
      <li className={className + " navitem"}>
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
      {
        name: "Choropleth Map",
        link: "https://mackville.net/d3/choropleth/",
      },
    ]

    return (
      <header className="z-depth-2" ref={node => this.node = node}>
        <nav id="header-nav">
          <div id="header-badge">
            <span id="header-badge-icon">
              <BarChart />
            </span>
            {"D3 Tree Map"}
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

  const {
    bgColor,
    children,
    dataValue,
    x,
    y,
    offsetX,
    offsetY,
    visible,
  } = props

  return (
    <div
      data-value={dataValue}
      id="tooltip"
      style={{
        backgroundColor: bgColor,
        left: x + offsetX,
        top: y + offsetY,
        display: visible ? "inline-block" : "none",
      }}
    >
      {children}
    </div>
  )
}

ToolTip.propTypes = {
  bgColor: PropTypes.string,
  children: PropTypes.any,
  dataValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  x: PropTypes.number,
  y: PropTypes.number,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  visible: PropTypes.bool,
}

ToolTip.defaultProps = {
  bgColor: "rgb(120, 167, 190)",
  children: "tooltip",
  dataValue: "",
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
    data: {},
  }

  state = {

  }


  componentDidUpdate() {
    return this.props.data && this.renderD3()
  }


  renderD3() {

    const { games: data } = this.props.data

    const colorScale = d3.scaleOrdinal(
      d3.schemeCategory20.map(
        color => d3.interpolateRgb(color, "#fff")(0.5)
      )
    )

    const root = d3.hierarchy(data)
      .eachBefore(d => d.data.id = (
        d.parent ? d.parent.data.id + "." : ""
      ) + d.data.name)
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value)

    this.renderD3Map(colorScale, root)
    this.renderD3Legend(colorScale, root)
  }


  renderD3Map(color, root) {
    
    const { width, height } = this.props.canvas
    
    const svg = d3.select(this.svg)

    const treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([width, height])
      .round(true)
      .paddingInner(2)

    treemap(root)

    const cell = svg.selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0}, ${d.y0})`)
      .on("mousemove", d => {
        const { name, category, value } = d.data
        const [x, y] = [d3.event.pageX, d3.event.pageY]
        ReactDOM.render(
          <ToolTip
            x={x}
            y={y}
            bgColor={d3.rgb(color(d.parent.data.name)).brighter(.5).toString()}
            dataValue={value}
            offsetX={10}
            offsetY={-30}
            visible
          >
            <div>Game: {name}</div>
            <div>Platform: {category}</div>
            <div>Value: {value}</div>
          </ToolTip>,
          tooltipdiv
        )
      })
      .on("mouseout", () => {
        ReactDOM.render(<ToolTip />, tooltipdiv)
      })

    cell.append("rect")
      .attr("class", "tile")
      .attr("id", d => d.data.id)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.parent.data.name))
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      

    cell.append("clipPath")
      .attr("id", d => `clip-${d.data.id}`)
      .append("use")
      .attr("xlink:href", d => `#${d.data.id}`)

    cell.append("text")
      .attr("clip-path", d => `url('#clip-${d.data.id}')`)
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter().append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 13 + i * 10)
      .text(d => d)

  }


  renderD3Legend(color, root) {

    const box = {
      width: 20,
      height: 20,
      padding: 12,
      yOffset: 20,
    }

    const categories = [...new Set(root.leaves().map(d => d.data.category))]


    const legend = d3.select(this.legend)
      .attr("class", "legend")
      .attr("id", "legend")

    const boxes = legend.selectAll("g")
      .data(categories)
      .enter()
      .append("g")

    boxes.append("rect")
      .attr("class", "legend-item")
      .attr("width", box.width)
      .attr("height", box.height)
      .attr("x", box.padding)
      .attr("y", (d,i) => i * (box.height + box.padding) + box.yOffset)
      .attr("dy", box.yOffset)
      .attr("fill", d => color(d))

    
    boxes.append("text")
      .attr("x", box.padding * 2 + box.width)
      .attr("y", (d,i) => i * (box.height + box.padding) + box.yOffset)
      .attr("dy", "1rem")
      .text(d => d)

  }


  render() {

    const { canvas } = this.props
    const { width, height } = canvas
    return (
      <main>
        <div id="title">
          {"Treemap"}
        </div>
        <div id="description">
          {"Video Game Sales Data Top 100 Grouped by Platform"}
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
          />
          <svg
            id="legend"
            width="140"
            height={height}
            ref={ node => this.legend = node}
          />
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
    const [games] = await Promise.all(
      data_urls
        .map(({url})=>fetch(url)
          .then(data=> (data.json()))
        ))
    this.setState({data: { games }})
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
      name: "game_sales",
      url: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json",
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