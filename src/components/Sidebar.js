import React, { Component } from 'react';
import { Form, Field } from 'react-final-form'
import { searchFlights } from '../api';
import DatePicker from 'react-datepicker'
import { Button } from 'react-bootstrap';


class Sidebar extends Component {

    state = {
        startDate: new Date(),
        endDate: new Date()
    }

    handleSubmit() {
        console.log('submit')
    }

  handleStartChange(date) {
    this.setState({
      startDate: date
    });
  }

  handleEndChange(date) {
    this.setState({
      endDate: date
    });
  }

    async search(formData) {
        const { setResults, setAirport } = this.props
        const origin = formData['origin']
        delete formData['origin']
        try {
            const flightData = searchFlights(origin, formData)
            // Update the active results and airport.
            setResults(flightData)
            setAirport(origin)
        } catch (e) {
            console.error('error getting flights', e)
        }
    }

    render() {
        const { startDate, endDate } = this.state
        return (
            <div className='sidebar-section'>


                <DatePicker
                    selected={endDate}
                    onChange={this.handleEndChange}
                />
                <DatePicker
                    selected={startDate}
                    onChange={this.handleStartChange}
                />

        <Button onClick={() => this.handleSubmit()} variant="success">Search</Button>


            </div>
        );
    }
}

export default Sidebar;