import React from "react"
import "./App.css"
import Home from "./components/Home"
import logo from "./assets/logo_inverted.png"
import { Navbar, Nav } from "react-bootstrap"

const APP_NAME = "Travelwire"

function App() {
  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" fixed="top">
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
      <Home />
    </div>
  )
}

export default App
