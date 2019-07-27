import React, { Component } from "react"
import FlipMove from "react-flip-move"
import plane from "../assets/plane.gif"
import chroma from "chroma-js"

import { findMatchingAirportByCode, getFlightResults } from "./../api"
import { Button, Modal } from "react-bootstrap"
import arrow_logo from "./../assets/arrow.png"

const BUTTON_SCALE = chroma.scale(["#0f0", "#f00"]).mode("lrgb")

class Results extends Component {
  state = {
    selectFlightOptions: [],
    show: false
  }

  constructor(props) {
    super(props)
    this.handleClose = this.handleClose.bind(this)
    this.handleShow = this.handleShow.bind(this)
  }

  handleClose() {
    this.setState({ show: false })
  }

  handleShow() {
    this.setState({ show: true })
  }

  getFlightSearchUrl({ origin, destination, departureDate, returnDate }) {
    return `https://www.google.com/flights#flt=${origin}.${destination}.${departureDate}*${origin}.${destination}.${returnDate}`
  }

  async selectFlight(flight) {
    const { setFlight } = this.props
    setFlight(flight)
    const offerLink = flight.links.flightDates
    if (!offerLink) {
      alert("No offers available for flight.")
      return
    }

    try {
      const data = await getFlightResults(offerLink)
      this.setState({ selectedFlightOptions: data.data })
    } catch (e) {
      console.log("error getting flight info", e)
      alert("Error getting flight information: " + e.message)
    }
  }

  render() {
    const { activeResults, activeFlight } = this.props
    const { show } = this.state
    if (!activeResults || activeResults.length == 0) {
      return <img className="plane-gif" src={plane} alt="taking off..." />
    }

    const flights = activeResults
      .map(res => {
        return res
      })
      .sort((a, b) => a.price.total - b.price.total)

    const getColor = (price, minPrice, maxPrice) => {
      const percentage = (price - minPrice) / (maxPrice - minPrice)
      return BUTTON_SCALE(percentage).hex()
    }

    const maxPrice = flights[flights.length - 1].price.total
    const minPrice = flights[0].price.total
    return (
      <div>
        <h5 className="result-header">
          We found a few flights you might be interested in...
        </h5>
        <FlipMove>
          {flights.map((result, i) => {
            const {
              origin,
              destination,
              departureDate,
              returnDate,
              price,
              links,
              dictionaries,
              destinationName
            } = result
            const total = price.total
            const match = findMatchingAirportByCode(destination)
            const dest = (match && match.name) || destinationName || destination
            result.destinationName = dest

            return (
              <div
                className="flight-result-row"
                key={i}
                onClick={() => {
                  this.selectFlight(result)
                }}
              >
                <b>{origin}</b> <img className="arrow-icon" src={arrow_logo} />{" "}
                <b>{dest}</b> from {departureDate} to {returnDate}
                <Button
                  style={{
                    backgroundColor: getColor(total, minPrice, maxPrice)
                  }}
                  className="flight-result-button"
                  onClick={this.handleShow}
                >
                  ${total}
                </Button>
              </div>
            )
          })}
        </FlipMove>

        {activeFlight && (
          <Modal
            show={show}
            onHide={this.handleClose}
            className="flight-select-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Book this flight</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                <b>You selected the following flight:</b>
              </p>
              <pre>
                Flight leaving from {activeFlight.origin} on{" "}
                {activeFlight.departureDate} to {activeFlight.destinationName}{" "}
                returning {activeFlight.returnDate}. Estimated cost: $
                {activeFlight.price.total}
              </pre>

              <p className="warning-text">
                Clicking continue will open a new tab to allow booking this
                flight. Do you want to proceed?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Go back
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  window.open(this.getFlightSearchUrl(activeFlight), "_blank")
                  this.handleClose()
                }}
              >
                Continue
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    )
  }
}

export default Results
