
const axios = require('axios')
const Fuse = require('fuse.js')
const airports = require('./../assets/airports').airports

const AMADEUS_KEY = process.env.REACT_APP_AMADEUS_KEY || 'NOT SPECIFIED'
const AMADEUS_SECRET = process.env.REACT_APP_AMADEUS_SECRET || 'NOT SPECIFIED'

const TOKEN_KEY = 'amadeusKey'

const searchOptions = {
    keys: ['name', 'city', 'code', 'country', 'state'],
    id: 'code'
}

const fuse = new Fuse(airports, searchOptions)

const BASE_URL = 'https://test.api.amadeus.com/v1/'

const TOKEN_URL = `${BASE_URL}/security/oauth2/token`
const FLIGHT_URL = `${BASE_URL}/shopping/flight-destinations`

const authedParams = (params) => {
    return { params, headers: {'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`}}
}

// shopping/flight-destinations?origin=MAD
// https://developers.amadeus.com/self-service/category/air/api-doc/flight-inspiration-search/api-reference
export const searchFlights = async (origin, params) => axios.get(FLIGHT_URL, authedParams({origin, ...params}))

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token)

export const refreshToken = async () => {
    const body = {
        client_id: AMADEUS_KEY,
        client_secret: AMADEUS_SECRET,
        grant_type: 'client_credentials'
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    return axios.post(TOKEN_URL, body, config)
}

export const findAirports = (query) => fuse.search(query)

