import React from 'react'
import 'font-awesome/css/font-awesome.css'
// import {Navbar, Nav, MenuItem, NavItem, NavDropdown} from 'react-bootstrap'

// Replaced NavItem from modules due to bug in NavItem
import { Navbar, Nav, MenuItem, NavDropdown } from 'react-bootstrap'
import NavItem from '../NavItem'


function Header(props) {

  let {url, icon, brand} = props

  return (
    <Navbar
        collapseOnSelect
        fixedTop
        inverse
    >
      <Navbar.Header>
        <Navbar.Brand>
          <a href={url}>
            <i
                className={icon.class}
                style={{
                  marginRight: '5px',
                  lineHeight: icon.height
                }}
            />
            <span>{brand}</span>
          </a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          <NavItem
              eventKey={1}
              href='/'
          >
            {'Portfolio'}
          </NavItem>
          <NavItem
              eventKey={2}
              href='/#contact'
          >
            {'Contact'}
          </NavItem>
          <NavDropdown
              eventKey={3}
              id='nav-dropdown-projects'
              title='Projects'
          >
            <MenuItem eventKey={3.1}>{'Action'}</MenuItem>
            <MenuItem eventKey={3.2}>{'Another action'}</MenuItem>
            <MenuItem eventKey={3.3}>{'Soemthing else here'}</MenuItem>
            <MenuItem divider />
            <MenuItem eventKey={3.3}>{'Seperated Link'}</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header