import React, { useEffect, useState, useRef, createRef } from 'react';
import { useSelector } from "react-redux";
import { MdSearch, MdClear } from "react-icons/md";

import './style.css'

function SearchBar() {
  const [searchText, setSearchText] = useState('');
  const [recomendations, setRecomendations] = useState([]);
  const [recomendationsShown, setRecomendationsShown] = useState(true);
  const [cleanButtonShown, setCleanButtonShown] = useState(false);
  const { citiesCoordinates: cities } = useSelector(state => ({ ...state.coordinatesReducer }))
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

  return (
    <div ref={ref}>
      <form className="input-container test423">
        <span className="input-icon">
          <MdSearch />
        </span>
        <input
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={(e) => setRecomendationsShown(true)}
          placeholder="Pesquisar cidade"
          type="text"
          name="search"
          id="search"
          value={searchText}
          autoComplete="off" />
        <span className="input-icon">
          {cleanButtonShown && (
            <MdClear onClick={() => setSearchText('')} />
          )}
        </span>
      </form>
      {recomendationsShown && (
        <div className="recomendation-container">
          {
            recomendations.map(c => (
              <div className="recomendation-item" key={c.ibgeCode}>{c.city}</div>
            ))
          }
        </div>
      )}
    </div>

  );
}

export default SearchBar;