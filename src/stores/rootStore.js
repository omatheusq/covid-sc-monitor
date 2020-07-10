import { createStore, combineReducers } from "redux";
import citiesCordinates from '../data/cities-codinates.json';

let INITIAL_STATE = {}

let sc = {
  city: "Santa Catarina",
  ibgeCode: 42
}

function selectedCityReducer(state = { selectedCity: sc}, action) {
  switch (action.type) {
    case "SET_CITY":
      return {
        ...state,
        selectedCity: action.city
      };
    case "DESELECT_CITY":
      return {
        ...state,
        selectedCity: sc
      };
    default:
      return state;
  }
}

function coordinatesReducer(state = { citiesCoordinates: citiesCordinates }, action) {
  return state;
}


const rootReducer = combineReducers({
  selectedCityReducer,
  coordinatesReducer
})

export const store = createStore(rootReducer, INITIAL_STATE);