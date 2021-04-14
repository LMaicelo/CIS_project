import React, { Component } from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

class Chart extends Component {
    constructor(props) {
        super(props);
        console.log("FullChartData is: " + props.fullChartData);
        let fcd = props.fullChartData;
        fcd.chartOptions.scales.xAxes = [{
            "ticks": {
                "userCallback": function(item, index) {
                    const dObj = new Date(item*1000);
                    return dObj.toLocaleString().split(',')[0];
                }
            },
                "scaleLabel": {
                    "display": true,
                    "labelString": "Time"
                }
            }
        ];
        this.state = fcd;
        // this.state = {
        //     chartData: {
        //         datasets: [
        //             {
        //                 label: props.label,
        //                 showLine: true,
        //                 fill: false,
        //                 borderColor: 'rgb(255, 99, 132)',
        //                 data: props.dataCoords.sort((a, b) => a.x - b.x),
        //                 backgroundColor: 'rgb(255, 99, 132)'
        //             }
        //         ],
        //     },
        //     chartOptions: {
        //         scales: {
        //             yAxes: [{
        //                 scaleLabel: {
        //                   display: true,
        //                   labelString: props.yAxisLabel
        //                 }
        //               }],
        //             xAxes: [{
        //                 scaleLabel: {
        //                   display: true,
        //                   labelString: "Time"
        //                 }
        //               }]
        //         }
        //     }
        // }
    }

    render() {
        return (
            <div className="chart">
                <Scatter
                    data={this.state.chartData}
                    options={this.state.chartOptions}
                    // options={{
                    //     title: {
                    //         display: this.props.displayTitle,
                    //         text: 'Largest Cities In ' + this.props.location,
                    //         fontSize: 25
                    //     },
                    //     legend: {
                    //         display: this.props.displayLegend,
                    //         position: this.props.legendPosition
                    //     }
                    // }}
                />
            </div>
        )
    }
}

export default Chart;