import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Line } from 'react-chartjs-2';
import { MdSearch, MdClear, MdChevronLeft } from "react-icons/md";
import moment from 'moment';

import api from '../../services/api'

import Map from '../../components/Map'

import './style.css'


export default function Chart() {
  const dispatch = useDispatch()
  const [covidData, setCovidData] = useState('');
  const [historicalCaseData, setHistoricalCaseData] = useState('');

  const { selectedCity } = useSelector(state => ({ ...state.selectedCityReducer }))

  const numberFormat = (value) => (parseInt(value) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const renderTest = (canvas) => {
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
        }
      ]
    }

    setHistoricalCaseData(config)
  }


  const handleDeselectCity = ()=> {
    dispatch({
      type: "DESELECT_CITY"
    })
  }

  const hasCitySelected = ()=> {
    return selectedCity && selectedCity.ibgeCode !== 42;
  }

  return (
    <div className="container">
      <div className="map-container-wrapper">
        <div className="test">
          <form className="input-container">
            <span className="input-icon">
              <MdSearch />
            </span>
            <input autocomplete="off" placeholder="Pesquisar" type="text" name="search" id="search" />
            <span className="input-icon">
              <MdClear />
            </span>
          </form>
        </div>
        <div className="chart-container">
          <Map />
        </div>
      </div>

      <div className="details-container">
        <div className="details">
          
          {hasCitySelected() && (
            <button className="back-to-state" onClick={handleDeselectCity}>
              <MdChevronLeft />
            </button>
          )}
          
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
                data={renderTest}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}