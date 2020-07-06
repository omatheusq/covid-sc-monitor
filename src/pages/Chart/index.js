import React, { useEffect } from 'react';

import Map from '../../components/Map'

import './style.css'

import { useSelector } from "react-redux";

export default function Chart() {

  const data = useSelector(state => {
    return state;
  });

  useEffect(() => {

  }, [data]);

  return (
    <div className="container">
      <div className="chart-container">
        <Map />
      </div>
      <div className="details-container">
        <div className="details">
          <p className="title">
            {data.city}
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