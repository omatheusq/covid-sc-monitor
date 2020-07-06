import React from 'react';

function reducer(state = {}, action) {
  switch (action.type) {
    case "SELECT_CITY":
      
      return action.payload;
    case "Bike":
      return {
        vehicle: "It is a Bike"
      };
    default:
      return state;
  }
}

export default reducer;