import React from 'react';
import Chart from './Chart';
import './Output.css';

class Output extends React.Component {
    constructor(props) {
      super(props);
      this.state = { chartLabel: "defaultLable", yAxisLabel: "Avg Rating", dataCoords: [{x:1, y: 2}, {x:3, y: 8}] };
    }

    callApi() {
      fetch("http://localhost:9000/accessOracle")
        .then(res => res.text())
        .then((res) => {
          console.log("Response is: " + res);
        });
    }
  
    componentDidMount() {
      this.callApi();
    }
    
    render() {
      return (
        <div className="Output">
          <Chart label={this.state.chartLabel} dataCoords={this.state.dataCoords} yAxisLabel={this.state.yAxisLabel}/>
        </div>
      )
    }
  }

  export default Output;
