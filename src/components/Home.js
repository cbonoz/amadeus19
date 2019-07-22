import React, { Component } from "react"
import Sidebar from "./Sidebar"
import Results from "./Results"
import ResultMap from "./ResultMap"
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
    if (activeResults) {
      this.setState({ activeResults })
    }
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
                activeAirport={activeAirport}
                activeResults={activeResults}
                setAirport={a => this.setAirport(a)}
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
                      setFlight={f => this.setFlight(f)}
                      setResults={r => this.setResults(r)}
                    />
                  )}
                  {activeFlight && (
                    <ResultMap
                      activeFlight={activeFlight}
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
