import React from 'react';
import Chart from './Chart';
import './Output.css';

class Output extends React.Component {
    constructor(props) {
      super(props);
      console.log("Full chart data in OUTPUT is: " + props.fullChartData);
      this.state = props.fullChartData;
    }
    
    render() {
      return (
        <div className="Output">
          <Chart fullChartData={this.state}/>
        </div>
      )
    }
  }

  export default Output;
