import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';

function HistoricalDataChart(props) {

  const [historicalCaseData, setHistoricalCaseData] = useState('');

  const render = (canvas) => {
    const height = 192, width = 384;

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(250,174,50,1)');
    gradient.addColorStop(1, 'rgba(250,174,50,0)');

    let res = historicalCaseData
    if (res) {
      res.datasets = res.datasets.map(d => ({
        backgroundColor: gradient,
        borderColor: "#ff6c23",
        borderWidth: 2,
        pointColor: "#fff",
        pointStrokeColor: "#ff6c23",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "#ff6c23",
        data: d.data,
        label: 'Casos'
      }))

      setHistoricalCaseData(res)
    }
    return historicalCaseData;
  }

  useEffect(() => {
    let data = props.data;
    if (data) {
      let labels = data.map(d => d.date)
      let caseDataset = data.map(d => d.cases)

      let config = {
        labels: labels,
        datasets: [
          {
            data: caseDataset,
            label: "Casos",
          }
        ]
      }

      setHistoricalCaseData(config)
    }

  }, [props])

  return (
    <Line
      data={render}
      options={{
        legend: {
          display: false
        },
        responsive: true,
        scales: {
          xAxes: [{
            ticks: {
              callback: value => {
                let m = new moment(value, "YYYY-MM-DD");
                return `${m.format('DD')}/${m.format('MM')}`
              }
            }
          }]
        }

      }}
      redraw={true} />
  );
}

export default HistoricalDataChart;