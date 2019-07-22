import React, { Component } from "react"
import FlipMove from "react-flip-move"
import plane from "../assets/plane.gif"

import { findMatchingAirportByCode, getFlightResults } from "./../api"
import { Button } from "react-bootstrap";

class Results extends Component {

    state = {
        selectFlightOptions: []
    }

    getFlightSearchUrl({origin, destination, departureDate, returnDate}) {
        return `https://www.google.com/flights#flt=${origin}.${destination}.${departureDate}*${origin}.${destination}.${returnDate}`
    }

    async selectFlight(flight) {
        // const { setFlight } = this.props
        // setFlight(flight)
        const offerLink = flight.links.flightDates
        if (!offerLink) {
            alert('No offers available for flight.')
            return
        }

        try {
            const data = await getFlightResults(offerLink)
            this.setState({selectedFlightOptions: data.data})

        } catch (e) {
            console.log('error getting flight info', e)
            alert('Error getting flight information: ' + e.message)
        }

    }
  render() {
    const { activeResults } = this.props
    if (!activeResults || activeResults.length == 0) {
      return <img className="plane-gif" src={plane} alt="taking off..." />
    }

    const flights = activeResults
      .map(res => {
        return res
      })
      .sort((a, b) => a.price.total - b.price.total)
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
            // let dest = findMatchingAirportByCode(destination)
            const dest = destinationName || destination

            return (
              <div className="flight-result-row" key={i} onClick={() => { this.selectFlight(result) }}>
                {origin} -> {dest} from {departureDate} to {returnDate}
                <Button target="_blank" variant='success' href={this.getFlightSearchUrl(result)}>${total}</Button>
              </div>
            )
          })}
        </FlipMove>
      </div>
    )
  }
}

export default Results
