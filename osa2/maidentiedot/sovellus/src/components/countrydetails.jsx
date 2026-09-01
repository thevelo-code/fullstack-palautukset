import {useState , useEffect} from 'react'
import countryservice from '../services/countryservice'

const api_key = import.meta.env.VITE_OWM_KEY
console.log('API Key:', api_key)


const WeatherDetails = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null)

    if (!api_key) {
        return <p>Weather data unavailable. API key is not defined.</p>
    }

  useEffect(() => {
    if (country) {
      countryservice
      .getWeather(country.capital, api_key)
      .then(data => {
        setWeatherData(data)
      })
      .catch(error => {
        console.log('Error fetching weather data:', error)
      })
    }
  }, [country])

  if (!weatherData) {
    return <p>Loading weather data...</p>
  }

  return (
    <div>
      <h3>Weather in {weatherData.name}</h3>
      <p>Temperature: {weatherData.main.temp} °C</p>
      <p>Wind: {weatherData.wind.speed} m/s</p>
      <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Weather icon" />
    </div>
  )
} 


const CountryDetails = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="200" />
      <WeatherDetails country={country} />
    </div>
  )
}

export default CountryDetails
