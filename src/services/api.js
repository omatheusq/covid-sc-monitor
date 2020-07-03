import data from './data.json'
import citiesCordinates from '../data/cities-codinates.json';


function formatResponse(data){

  let cities = data.filter(c=> c.city !== null && c.city_ibge_code !== null)
    .map(c=> ({
      city: c.city,
      ibgeCode: c.city_ibge_code,
      date: c.date,
      lastAvailable: c.last_available_confirmed,
      lastAvailableDeaths: c.last_available_deaths,
      newConfirmed:  c.new_confirmed,
      newDeaths: c.new_deaths,
      latLng: (citiesCordinates.find(y=> y.ibgeCode === c.city_ibge_code) || {}).latLng
    }))

    return cities
}

let api = {
  getData: ()=>{
    return formatResponse(data.results)
  }
}

export default api