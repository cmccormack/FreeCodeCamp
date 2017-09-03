import React from 'react'
import 'font-awesome/css/font-awesome.css'
import { 
  Navbar,
  Nav,
  MenuItem,
  NavItem,
  NavDropdown
} from 'react-bootstrap'

function Footer (props) {

  let {url, icon, brand} = props
  return(
    <Navbar 
        collapseOnSelect
        fixedBottom
        inverse
    >
      <Navbar.Header>
        <Navbar.Brand>
          <a href={url ? url : '#'}>
            { icon && 
              <i
                  className={icon}
                  style={{marginRight: '5px', lineHeight: icon.height}}
              />
            }
            { brand &&
              <span>{brand}</span>
            }
          </a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavItem eventKey={1} href="#">{'Link'}</NavItem>
          <NavItem eventKey={2} href="#">{'Link'}</NavItem>
          <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
            <MenuItem eventKey={3.1}>{'Action'}</MenuItem>
            <MenuItem eventKey={3.2}>{'Another action'}</MenuItem>
            <MenuItem eventKey={3.3}>{'Soemthing else here'}</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.3}>{'Seperated Link'}</MenuItem>
          </NavDropdown>
        </Nav>
        <Nav pullRight>
          <NavItem eventKey={1} href="#">{'Link Right'}</NavItem>
          <NavItem eventKey={2} href="#">{'Link Right'}</NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
export default Footer