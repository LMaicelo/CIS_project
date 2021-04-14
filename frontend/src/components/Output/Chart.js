import React, { Component } from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = props.fullChartData;
        // this.state = {
        //     "chartData": {
        //         "datasets": [
        //             {
        //                 "label": "ASS KICKIN",
        //                 "showLine": true,
        //                 "fill": false,
        //                 "borderColor": "rgb(255, 99, 132)",
        //                 "data": [
        //                     {
        //                         "x": 1366502400,
        //                         "y": 4.2
        //                     },
        //                     {
        //                         "x": 1398038400,
        //                         "y": 4.6470588235294095
        //                     },
        //                     {
        //                         "x": 1429574400,
        //                         "y": 4.285714285714289
        //                     },
        //                     {
        //                         "x": 1461110400,
        //                         "y": 3.5
        //                     },
        //                     {
        //                         "x": 1492646400,
        //                         "y": 4
        //                     }
        //                 ],
        //                 "backgroundColor": "rgb(255, 99, 132)"
        //             },
        //             {
        //                 "label": "Bhut Kisser",
        //                 "showLine": true,
        //                 "fill": false,
        //                 "borderColor": "rgb(255, 99, 132)",
        //                 "data": [
        //                     {
        //                         "x": 1366502400,
        //                         "y": 5
        //                     },
        //                     {
        //                         "x": 1429574400,
        //                         "y": 4
        //                     },
        //                     {
        //                         "x": 1461110400,
        //                         "y": 4
        //                     },
        //                     {
        //                         "x": 1524182400,
        //                         "y": 5
        //                     }
        //                 ],
        //                 "backgroundColor": "rgb(255, 99, 132)"
        //             },
        //             {
        //                 "label": "Blairs",
        //                 "showLine": true,
        //                 "fill": false,
        //                 "borderColor": "rgb(255, 99, 132)",
        //                 "data": [
        //                     {
        //                         "x": 1366502400,
        //                         "y": 4.375
        //                     },
        //                     {
        //                         "x": 1398038400,
        //                         "y": 3
        //                     },
        //                     {
        //                         "x": 1461110400,
        //                         "y": 5
        //                     },
        //                     {
        //                         "x": 1492646400,
        //                         "y": 5
        //                     }
        //                 ],
        //                 "backgroundColor": "rgb(255, 99, 132)"
        //             },
        //             {
        //                 "label": "Bravado Spice",
        //                 "showLine": true,
        //                 "fill": false,
        //                 "borderColor": "rgb(255, 99, 132)",
        //                 "data": [
        //                     {
        //                         "x": 1429574400,
        //                         "y": 2
        //                     },
        //                     {
        //                         "x": 1461110400,
        //                         "y": 2
        //                     },
        //                     {
        //                         "x": 1492646400,
        //                         "y": 4.15384615384615
        //                     },
        //                     {
        //                         "x": 1524182400,
        //                         "y": 5
        //                     }
        //                 ],
        //                 "backgroundColor": "rgb(255, 99, 132)"
        //             },
        //             {
        //                 "label": "CaJohns",
        //                 "showLine": true,
        //                 "fill": false,
        //                 "borderColor": "rgb(255, 99, 132)",
        //                 "data": [
        //                     {
        //                         "x": 1366502400,
        //                         "y": 5
        //                     },
        //                     {
        //                         "x": 1398038400,
        //                         "y": 3
        //                     },
        //                     {
        //                         "x": 1429574400,
        //                         "y": 5
        //                     },
        //                     {
        //                         "x": 1461110400,
        //                         "y": 5
        //                     },
        //                     {
        //                         "x": 1492646400,
        //                         "y": 4.66666666666667
        //                     }
        //                 ],
        //                 "backgroundColor": "rgb(255, 99, 132)"
        //             },
        //             {
        //                 "label": "CaJohns Fiery Foods",
        //                 "showLine": true,
        //                 "fill": false,
        //                 "borderColor": "rgb(255, 99, 132)",
        //                 "data": [
        //                     {
        //                         "x": 1366502400,
        //                         "y": 4.82222222222222
        //                     }
        //                 ],
        //                 "backgroundColor": "rgb(255, 99, 132)"
        //             }
        //         ]
        //     },
        //     "chartOptions": {
        //         "scales": {
        //             "yAxes": [
        //                 {
        //                     "scaleLabel": {
        //                         "display": true,
        //                         "labelString": "Average Review Rating"
        //                     }
        //                 }
        //             ],
        //             "xAxes": [
        //                 {
        //                     "scaleLabel": {
        //                         "display": true,
        //                         "labelString": "Time"
        //                     }
        //                 }
        //             ]
        //         }
        //     }
        // }
        /*this.state = {
            chartData: {
                datasets: [
                    {
                        label: props.label,
                        showLine: true,
                        fill: false,
                        borderColor: 'rgb(255, 99, 132)',
                        data: props.dataCoords.sort((a, b) => a.x - b.x),
                        backgroundColor: 'rgb(255, 99, 132)'
                    }
                ],
            },
            chartOptions: {
                scales: {
                    yAxes: [{
                        scaleLabel: {
                          display: true,
                          labelString: props.yAxisLabel
                        }
                      }],
                    xAxes: [{
                        scaleLabel: {
                          display: true,
                          labelString: "Time"
                        }
                      }]
                }
            }
        }*/
        // this.state = {
        //     chartData: {
        //         labels: props.labels,
        //         datasets: [
        //             {
        //                 label: 'Population',
        //                 data: [
        //                     617594,
        //                     181045,
        //                     153060,
        //                     106519,
        //                     105162,
        //                     95072
        //                 ],
        //                 backgroundColor: [
        //                     'rgba(255, 99, 132, 0.6)',
        //                     'rgba(54, 162, 235, 0.6)',
        //                     'rgba(255, 206, 86, 0.6)',
        //                     'rgba(75, 192, 192, 0.6)',
        //                     'rgba(153, 102, 255, 0.6)',
        //                     'rgba(255, 159, 64, 0.6)',
        //                     'rgba(255, 99, 132, 0.6)'
        //                 ]
        //             }
        //         ]
        //     }
        // }
    }

    // static defaultProps = {
    //     displayTitle: true,
    //     displayLegend: true,
    //     legendPosition: 'right',
    //     location: 'City'
    // }

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