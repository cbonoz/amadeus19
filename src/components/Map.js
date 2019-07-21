import React, { Component } from 'react';

class Map extends Component {
    render() {
        const { activeAirport, activeFlight } = this.props
        return (
            <div>
                <h3>Selected Flight</h3>
                <div>{JSON.stringify(activeFlight)}</div>


                {/* TODO: add map showing the result going from origin to destination */}
            </div>
        );
    }
}

export default Map;