/*eslint no-console: 'off'*/

import React from 'react'
import 'font-awesome/css/font-awesome.css'

// Replaced NavItem from modules due to bug in NavItem
import Navbar from 'react-bootstrap/lib/NavBar'
import Nav from 'react-bootstrap/lib/Nav'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import NavDropdown from 'react-bootstrap/lib/NavDropdown'

import NavItem from '../NavItem'


function Header(props) {

  let {brand, navItems, dropdown} = props

  let eventKeys = {
    navCollapse: {
      navItemsCount: 0,
      navDropdown: {
        menuItemsCount: 0
      }
    }
  }

  return (
    <Navbar
        collapseOnSelect
        fixedTop
    >
      <Navbar.Header>
        <Navbar.Brand>
          <a href={brand.url}>
            <i
                className={brand.icon.class}
                style={{
                  marginRight: '5px',
                  lineHeight: brand.icon.height
                }}
            />
            <span>{brand.title}</span>
          </a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          {navItems.map(item=>{
            return(
              <NavItem
                  eventKey={++eventKeys.navCollapse.navItemsCount}
                  href={item.url}
                  key={item.name}
              >
                {item.name}
              </NavItem>
            )
          })}
          <NavDropdown
              eventKey={++eventKeys.navCollapse.navItemsCount}
              id={dropdown.id}
              title={dropdown.title}
          >
            {
              dropdown.menuItems.map((item)=>buildMenuItem(item,eventKeys))
            }
            <MenuItem divider />
            {
              dropdown.footer.map((item)=>buildMenuItem(item,eventKeys))
            }
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

function buildMenuItem(item, eventKeys){
  let dropdown = eventKeys.navCollapse.navDropdown
  let eventKey = +`${dropdown.self}.${++dropdown.menuItemsCount}`
  return (
    <MenuItem 
        eventKey={eventKey}
        href={item.url}
        key={item.name}
    >
      {item.name}
    </MenuItem>
  )
}

export default Header