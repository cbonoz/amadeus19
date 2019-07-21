import React, { Component } from "react"
import Sidebar from "./Sidebar"
import Results from "./Results"
import Map from "./Map"
// import { searchFlights, findAirports } from './../api'
import "react-datepicker/dist/react-datepicker.css"
import { Container, Row, Col } from "react-bootstrap"

class Home extends Component {
  state = {
    activeFlight: null,
    activeAirport: {},
    activeResults: []
  }

  setResults(activeResults) {
    this.setState({ activeResults })
  }

  setFlight(activeFlight) {
    this.setState({ activeFlight })
  }

  clearFlight() {
    this.setFlight(null)
  }

  setAirport(activeAirport) {
    this.setState({ activeAirport })
  }

  render() {
    const { activeAirport, activeFlight, activeResults } = this.state
    return (
      <div>
        <Container>
          <Row>
            <Col xs={12} md={4}>
              <Sidebar
                setFlight={a => this.setAirport(a)}
                setResults={r => this.setResults(r)}
              />
            </Col>
            <Col xs={12} md={8}>
              {activeResults && (
                <div>
                  {!activeFlight && (
                    <Results
                      activeResults={activeResults}
                      activeAirport={activeAirport}
                      setResults={r => this.setResults(r)}
                    />
                  )}
                  {activeFlight && (
                    <Map
                      activeAirport={activeAirport}
                      clearFlight={this.clearFlight}
                    />
                  )}
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default Home
