import { createStore, combineReducers } from "redux";
import citiesCordinates from '../data/cities-codinates.json';

let INITIAL_STATE = {}


function selectedCityReducer(state = { selectedCity: {}}, action){
  switch (action.type) {
    case "SET_CITY":
      return {
        ...state,
        selectedCity: action.city
      };
    default:
      return state;
  }
}

function coordinatesReducer(state = { citiesCoordinates: citiesCordinates}, action){
  return state;
}


const rootReducer = combineReducers({
  selectedCityReducer,
  coordinatesReducer
})

export const store = createStore(rootReducer, INITIAL_STATE);