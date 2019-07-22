const axios = require("axios")
const Fuse = require("fuse.js")
const querystring = require('querystring');

const airports = require("./../assets/airports").airports

const AMADEUS_KEY = process.env.REACT_APP_AMADEUS_KEY || "NOT SPECIFIED"
const AMADEUS_SECRET = process.env.REACT_APP_AMADEUS_SECRET || "NOT SPECIFIED"

const TOKEN_KEY = "amadeusKey"

const searchOptions = {
  keys: ["name", "city", "code", "country", "state"]
}

const fuse = new Fuse(airports, searchOptions)

const BASE_URL = "https://test.api.amadeus.com/v1"

const TOKEN_URL = `${BASE_URL}/security/oauth2/token`
const FLIGHT_URL = `${BASE_URL}/shopping/flight-destinations`

const authedParams = params => {
  return {
    params,
    headers: { Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}` }
  }
}

const axiosInstance = axios.create({
  timeout: 5000
})

export const findAirports = query => {
  const results = fuse.search(query)
  return results.slice(0, Math.min(5, results.length))
}

// shopping/flight-destinations?origin=MAD
// https://developers.amadeus.com/self-service/category/air/api-doc/flight-inspiration-search/api-reference
export const searchFlights = async (origin, params) => {
  const paramsWithAuth = authedParams({ origin, ...params })
  return axiosInstance.get(FLIGHT_URL, paramsWithAuth)
}
export const findMatchingAirportByCode = (code) => {
  return airports.find((airport) => airport.code === code)
}

export const findMatchingAirportByName = (name) => {
  return airports.find((airport) => airport.name === name)
}

export const saveToken = token => localStorage.setItem(TOKEN_KEY, token)

export const getFlightResults = async (url) => {
  return axiosInstance.get(url, authedParams({}))
}

export const refreshToken = async () => {
  const data = querystring.stringify({
    client_id: AMADEUS_KEY,
    client_secret: AMADEUS_SECRET,
    grant_type: "client_credentials",
    "Content-Type": "application/x-www-form-urlencoded",
  })

  const headers = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  }
  return axiosInstance.post(TOKEN_URL, data, headers)
}

axiosInstance.interceptors.response.use(response => response, async (error) => {
    const status = error.response ? error.response.status : null
    const originalRequest = error.config

    if (status === 401) {
      const data = await refreshToken()
      const token = data.data.access_token
      saveToken(token)
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return axiosInstance.request(originalRequest)
    }

    return Promise.reject(error)
    // return error.config
  }
)