import React from "react"
import Home from "./components/Home"
import logo from "./assets/logo_inverted.png"
import { Navbar, Nav } from "react-bootstrap"

const APP_NAME = "Travelwire"

function App() {
  return (
    <div className="App">
      <Navbar fixed="top">
        <Navbar.Brand href="#home">
          <img
            alt={APP_NAME}
            src={logo}
            height="50"
            className="d-inline-block align-top"
          />
          {/* {APP_NAME} */}
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Nav.Link href="#search">Discover Flights</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
      <div className='home-content'>
        <Home />
      </div>
    </div>
  )
}

export default App
