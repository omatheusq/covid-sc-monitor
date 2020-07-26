import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { MdSearch, MdClear } from "react-icons/md";

import './style.css'

function SearchBar() {
  const [recomendations, setRecomendations] = useState([]);
  const [cleanButtonShown, setCleanButtonShown] = useState(false);
  const { citiesCoordinates: cities } = useSelector(state => ({ ...state.coordinatesReducer }))

  useEffect(() => {
    console.log(cities)
  }, cities)

  useEffect(() => {
    if(recomendations.length === 0){
      setCleanButtonShown(false)
    }else{
      setCleanButtonShown(true)
    }
  }, [recomendations])

  const onSearchHandler = (e)=> {
    let value = e.target.value;

    if(value == ''){
      setRecomendations([])
    }else{
      let recomendations = cities.filter(c=> {
        let cityName = c.city.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        let valueToFind = value.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
        return cityName.includes(valueToFind)
      })
      setRecomendations(recomendations.slice(0, 5))
    }

    

  }

  return (
    <div>
<form className="input-container">
      <span className="input-icon">
        <MdSearch />
      </span>
      <input
        onChange={onSearchHandler}
        placeholder="Pesquisar cidade"
        type="text"
        name="search"
        id="search"
        autoComplete="off" />
      <span className="input-icon">
        { cleanButtonShown && <MdClear />}
      </span>
    </form>
    <div className="recomendation-container">
      {
        recomendations.map(c=> (
          <div className="recomendation-item">{c.city}</div>
        ))
      }
      </div>
    </div>
    
  );
}

export default SearchBar;