import React, { useState } from 'react';

import Map from '../../components/Map'

import './style.css'


import { store } from "../../stores/rootStore.js";

export default function Chart() {

  const [selectedCity, setSelectedCity] = useState('');

  store.subscribe(()=> {
    setSelectedCity(store.getState())
  })
  

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