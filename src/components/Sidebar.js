import React, { Component } from "react"
import { Form, Field } from "react-final-form"
import DatePicker from "react-datepicker"
import Autocomplete from "react-autocomplete"
import { Button } from "react-bootstrap"
import dayjs from "dayjs"
import {
  findAirports,
  findMatchingAirportByName,
  searchFlights
} from "./../api"
import NumericInput from "react-numeric-input"

function parse(stringValue) {
  return stringValue.replace(/^\$/, "")
}

function getDefaultDate() {
  var myDate = new Date();
  myDate.setDate(myDate.getDate() + 1);
  return myDate
}

const initialState = {
  startDate: getDefaultDate(),
  endDate: getDefaultDate(),
  airport: "",
  airportList: [],
  maxPrice: 500
}

class Sidebar extends Component {
  state = Object.assign({}, initialState)

  componentDidMount() {
    this.handleEndChange = this.handleEndChange.bind(this)
    this.handleStartChange = this.handleStartChange.bind(this)
  }

  handleSubmit() {
    let { startDate, endDate } = this.state
    const airport = this.props.activeAirport || {}
    if (!airport || !airport.name) {
      alert("You must select an airport from the dropdown search to begin")
      return
    }

    if (!startDate || !endDate) {
      alert("Start and end dates must be provided")
      return
    }

    startDate = dayjs(startDate) // parse
    endDate = dayjs(endDate)
    const duration = endDate.diff(startDate, "day") + 1
    if (duration <= 0) {
      alert("end date must be after start date")
      return
    }

    // const departureDate = `${startDate.format("YYYY-MM-DD")},${startDate.add(duration, 'day').format("YYYY-MM-DD")}`//,${endDate.format("YYYY-MM-DD")}`.replace('+', '')
    const departureDate = startDate.format("YYYY-MM-DD")
    console.log("submit")
    this.search({ airport, departureDate, duration})
  }

  reset() {
    const { setResults, setAirport } = this.props
    setResults([])
    setAirport('')
    this.setState(initialState)
  }

  handleStartChange(startDate) {
    this.setState({
      startDate
    })
  }

  handleMaxPriceChange(maxPrice) {
    this.setState({ maxPrice })
  }

  handleEndChange(endDate) {
    this.setState({
      endDate
    })
  }

  async search(formData) {
    const { setResults, setAirport } = this.props
    const { maxPrice } = this.state
    if (maxPrice) {
      formData.maxPrice = maxPrice
    }
    const origin = formData["airport"].code
    formData.currency = "USD"
    delete formData["airport"]
    try {
      const response = await searchFlights(origin, formData)
      // Update the active results and airport.
      const responseData = response.data
      const locationDict = responseData.dictionaries.locations
      const flightInfo = responseData.data.map(entry => {
        entry.destinationName = locationDict[entry.destination].detailedName
        return entry
      })
      setResults(flightInfo)
    } catch (e) {
      console.error("error getting flights", JSON.stringify(e))
      if (e.message.indexOf("404") !== -1 || e.message.indexOf(500) !== -1) {
        alert("No flights found matching criteria. Try another query!")
      } else {
        alert("Error getting flights: " + JSON.stringify(e.message))
      }
    }
  }

  render() {
    const { startDate, endDate, airport, airportList, maxPrice } = this.state
    const { setAirport, activeResults } = this.props

    return (
      <div className="sidebar-section">
        <p className="search-text">Inspirational Travel just a search away</p>

        <div className="sidebar-option-section">
          <div className="sidebar-item">
            <h4>Find your next adventure</h4>
            <br />
            <div className="sidebar-item airport-section">
              <Autocomplete
                value={airport}
                inputProps={{
                  id: "states-autocomplete",
                  placeholder: "Search Airports"
                }}
                wrapperStyle={{ position: "relative", display: "inline-block" }}
                items={airportList}
                getItemValue={item => item.name}
                // shouldItemRender={ matchStocks }
                onChange={(event, airport) => {
                  this.setState({ airport, airportList: findAirports(airport) })
                }}
                onSelect={airport => {
                  this.setState({ airport })
                  setAirport(findMatchingAirportByName(airport))
                }}
                renderMenu={children => (
                  <div className="select-menu">{children}</div>
                )}
                renderItem={(item, isHighlighted) => (
                  <div
                    className={`select-item item ${
                      isHighlighted ? "item-highlighted" : ""
                    }`}
                    key={item.code}
                  >
                    {item.name}
                  </div>
                )}
              />
            </div>
          </div>
          <hr/>
          <div className="sidebar-item">
            From:{" "}
            <DatePicker
              selected={startDate}
              onChange={this.handleStartChange}
            />
          </div>
          <div className="sidebar-item">
            To:{" "}
            <DatePicker selected={endDate} onChange={this.handleEndChange} />
          </div>

          <div className="sidebar-item">
            Max Price: ${" "}
            <NumericInput
              precision={2}
              value={maxPrice}
              onChange={v => this.handleMaxPriceChange(v)}
            />
          </div>

          <br />
          <div className="submit-button-section">
            <Button onClick={() => this.handleSubmit()} variant="success">
              Search
            </Button>
            &nbsp;
            {(activeResults && activeResults.length > 0) && <Button onClick={() => this.reset()} variant="danger">
              Start Over
            </Button>}
          </div>
        </div>

        {activeResults && activeResults.length > 10 && <div>

          <p className='bottom-result-text'>...maybe more than a few flights</p>
          
        </div>}
      </div>
    )
  }
}

export default Sidebar
