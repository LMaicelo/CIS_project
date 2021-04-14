import React from 'react';
import Chart from './Chart';
import './Output.css';

class Output extends React.Component {
    constructor(props) {
      super(props);
      console.log("Full chart data in OUTPUT is: " + props.fullChartData);
      this.state = props.fullChartData;
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
          <Chart fullChartData={this.state}/>
        </div>
      )
    }
  }

  export default Output;
