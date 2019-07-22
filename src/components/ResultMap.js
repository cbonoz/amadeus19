import React, { Component } from "react"
import { Map, Marker, Popup, TileLayer } from "react-leaflet"

class ResultMap extends Component {
    
  render() {
    const position = [51.505, -0.09]
    const { activeAirport, activeFlight } = this.props

    return (
      <div>
        <h3>Selected Flight</h3>
        <div>{JSON.stringify(activeFlight)}</div>
        {/* <Map center={position} zoom={13}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup.
              <br />
              Easily customizable.
            </Popup>
          </Marker>
        </Map> */}
      </div>
    )
  }
}

export default ResultMap
