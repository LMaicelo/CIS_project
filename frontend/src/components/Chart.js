import React, { Component } from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        }
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