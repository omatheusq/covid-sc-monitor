import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Map from '../../components/Map'
import { store } from "../../stores/rootStore.js";

import './style.css'


export default function Chart() {

  const [selectedCity, setSelectedCity] = useState('');
  const [covidData, setcovidData] = useState('');

  store.subscribe(()=> {
    setSelectedCity(store.getState())
  })


  useEffect(()=> {
    axios.get(`https://covid-sc-monitor-backend.herokuapp.com/city/${selectedCity.ibgeCode}`)
      .then(res => {
        console.log(res.data)
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
                999
              </div>
            </div>
            <div className="summary-item">
              <div className="description">
                Obitos:
              </div>
              <div className="value">
                10
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}