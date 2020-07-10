import axios from 'axios';

const api = axios.create({
  baseURL: 'https://covid-sc-monitor-backend.herokuapp.com/'
})

export default api;