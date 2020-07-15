import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';

import api from '../../services/api'

import Map from '../../components/Map'

import './style.css'


export default function Chart() {

  const [covidData, setCovidData] = useState('');
  const [historicalCaseData, setHistoricalCaseData] = useState('');

  const { selectedCity } = useSelector(state => ({ ...state.selectedCityReducer }))

  const numberFormat = (value) => (parseInt(value) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });


  useEffect(() => {
    api.get(`/city/${selectedCity.ibgeCode}`)
      .then(res => {
        setCovidData(res.data)
      })

    api.get(`/city/${selectedCity.ibgeCode}/history`)
      .then(res => {
        createChartCases(res.data)

      })
  }, [selectedCity])


  let createChartCases = (data) => {

    let labels = data.map(d => d.date)
    let caseDataset = data.map(d => d.cases)

    let config = {
      labels: labels,
      datasets: [
        {
          data: caseDataset,
          label: "Casos",
          borderColor: "#3e95cd",
          fill: false
        }
      ]
    }

    setHistoricalCaseData(config)
  }

  return (
    <div className="container">
      <div className="chart-container">
        <Map />
      </div>
      <div className="details-container">
        <div className="details">
          <p className="title">
            {selectedCity.city || 'Santa Catarina'}
          </p>
          <div className="summary">
            <div className="summary-item">
              <div className="description">
                Casos confirmados:
              </div>
              <div className="value">
                {numberFormat(covidData.caseCount)}
              </div>
            </div>
            <div className="summary-item">
              <div className="description">
                Obitos:
              </div>
              <div className="value">
                {numberFormat(covidData.deathCount)}
              </div>
            </div>
            <div >
              <div className="chart-title">
                Casos:
              </div>
              <Line
                data={historicalCaseData}
                options={{
                  legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                      display: false //this will remove all the x-axis grid lines
                    }]
                  }
                }}
                redraw={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}