import React from 'react'
import 'font-awesome/css/font-awesome.css'
// import { Navbar, Nav } from 'react-bootstrap'
import Navbar from 'react-bootstrap/lib/NavBar'
import Nav from 'react-bootstrap/lib/Nav'

import NavItem from '../NavItem'

function Footer (props) {

  let {url, icon, brand, social} = props
  let iconStyle = {
    fontSize: '1.2em'
  }

  return(
    <Navbar 
        collapseOnSelect
        fixedBottom
    >
      <Navbar.Header>
        <Navbar.Brand>
          <a 
              href={url}
              style={{fontSize: '1em'}}
          >
            <i
                className={icon.class}
                style={{
                  marginRight: '5px',
                  lineHeight: icon.height
                }}
            />
            <span >{brand}</span>
          </a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav pullRight>
          {social.map((item, i)=>{
            return (
              <NavItem 
                  eventKey={i}
                  href={item.url}
                  key={item.name}
              >
                <div className='social-icon'>
                  <i 
                      className={item.icon} 
                      style={iconStyle}
                  />
                </div>
                <span className={'show-on-collapse'}>{item.name}</span>
              </NavItem>
            )
          })}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
export default Footer



