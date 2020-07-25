import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdSearch, MdClear, MdChevronLeft } from "react-icons/md";

import api from '../../services/api'
import Map from '../../components/Map'
import HistoricalDataChart from '../../components/HistoricalDataChart'

import './style.css'

export default function Chart() {
  const dispatch = useDispatch()
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
        setHistoricalCaseData(res.data)
      })
  }, [selectedCity])

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
            <input placeholder="Pesquisar" type="text" name="search" id="search" autoComplete="off"/>
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
                <HistoricalDataChart data={historicalCaseData}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}