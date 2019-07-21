import React, { Component } from 'react';
import FlipMove from 'react-flip-move';

class Results extends Component {
    render() {
        const { activeResults, setFlight } = this.props
        return (
            <div>
                <FlipMove>
                    {activeResults.map((result, i) => (
                        <div key={i} onClick={(result) => setFlight(result)} >
                            {JSON.stringify(result)}
                        </div>
                    ))}
                </FlipMove>
            </div>
        );
    }
}

export default Results;