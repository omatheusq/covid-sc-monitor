import { createStore } from "redux";

function reducer(state = {}, action) {
  switch (action.type) {
    case "SET_CITY":
      return action.city;
    default:
      return state;
  }
}

export const store = createStore(reducer);