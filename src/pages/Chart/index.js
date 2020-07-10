import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api'

import Map from '../../components/Map'

import './style.css'


export default function Chart() {

  const [covidData, setCovidData] = useState('');

  const { selectedCity } = useSelector(state => ({ ...state.selectedCityReducer }))

  const numberFormat = (value) => (parseInt(value) || 0).toLocaleString(undefined, {maximumFractionDigits:2}) ;


  useEffect(() => {
    api.get(`/city/${selectedCity.ibgeCode}`)
      .then(res => {
        setCovidData(res.data)
      })
  }, [selectedCity])


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
          </div>
        </div>
      </div>
    </div>
  )
}