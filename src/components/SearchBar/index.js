import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { MdSearch, MdClear } from "react-icons/md";

import './style.css'

function SearchBar() {
  const [searchText, setSearchText] = useState('');
  const [recomendations, setRecomendations] = useState([]);
  const [recomendationsShown, setRecomendationsShown] = useState(true);
  const [cleanButtonShown, setCleanButtonShown] = useState(false);
  const [selectedCity, setSelectedCity] = useState(undefined);
  const dispatch = useDispatch()

  const { citiesCoordinates: cities } = useSelector(state => ({ ...state.coordinatesReducer }))
  const { selectedCity: rootCity } = useSelector(state => ({ ...state.selectedCityReducer }))

  const ref = useRef();

  useOnClickOutside(ref, () => setRecomendationsShown(false));

  function useOnClickOutside(ref, handler) {
    useEffect(
      () => {
        const listener = event => {
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
          handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
          document.removeEventListener('mousedown', listener);
          document.removeEventListener('touchstart', listener);
        };
      },
      [ref, handler]
    );
  }

  useEffect(() => {
    const value = searchText;
    if (value == '') {
      setRecomendations([])
      setSelectedCity(undefined)
    } else {
      let recomendations = cities.filter(c => {
        let cityName = c.city.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        let valueToFind = value.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return cityName.includes(valueToFind)
      })
      setRecomendations(recomendations.slice(0, 5))
    }
  }, [searchText])

  useEffect(() => {
    if (recomendations.length === 0) {
      setCleanButtonShown(false)
    } else {
      setCleanButtonShown(true)
    }
  }, [recomendations])

  useEffect(() => {
    if (selectedCity) {
      dispatch({
        type: "SET_CITY",
        city: selectedCity
      })
      setSearchText(selectedCity.city)
    } else {
      dispatch({
        type: "DESELECT_CITY"
      })

    }

    setRecomendationsShown(false)
  }, [selectedCity])

  useEffect(() => {
    if (selectedCity && rootCity) {
      if (selectedCity.ibgeCode !== rootCity.ibgeCode) {
        if (rootCity.ibgeCode !== 42) {
          setCleanButtonShown(true)
          setSelectedCity(rootCity)
        } else {
          setSearchText('')
          setSelectedCity(undefined)
        }
      }
    } else if (rootCity) {
      if (rootCity.ibgeCode !== 42) {
        setCleanButtonShown(true)
        setSelectedCity(rootCity)
      }
    }
  }, [rootCity])

  const selectedIfHasJustOneRecomendation = () => {
    if (recomendations.length === 1) {
      setSelectedCity(recomendations[0])
    }
  }

  return (
    <div ref={ref}>
      <form className="input-container test423" onSubmit={(e) => { e.preventDefault(); selectedIfHasJustOneRecomendation() }}>
        <span className="input-icon">
          <MdSearch />
        </span>
        {

          !selectedCity
            ? (
              <input
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setRecomendationsShown(true)}
                placeholder="Pesquisar cidade"
                type="text"
                name="search"
                id="search"
                value={searchText}
                tabIndex="1"
                autoComplete="off" />
            )
            : (
              <div className="selected-city-container">
                <div className="selected-city">
                  {selectedCity.city}
                </div>
              </div>
            )
        }

        <span className="input-icon" onClick={() => setSearchText('')}>
          {cleanButtonShown && (
            <MdClear />
          )}
        </span>
      </form>
      {recomendationsShown && (
        <div className="recomendation-container">
          {
            recomendations.map((c, index) => (
              <div
                className="recomendation-item"
                tabIndex={index + 1}
                key={c.ibgeCode}
                onClick={() => setSelectedCity(c)}
                onKeyDown={(e) => {
                  const isTabCode = e.keyCode === 9;
                  const isEnterCode = e.keyCode === 13;
                  console.log(e.keyCode)
                  let isLast = index === recomendations.length - 1;
                  if (isTabCode && isLast) {
                    document.getElementById("search").focus()
                    e.preventDefault()
                  }else if(isEnterCode){
                    setSelectedCity(c)
                  }
                }}
              >
                {c.city}
              </div>
            ))
          }
        </div>
      )}
    </div>

  );
}

export default SearchBar;