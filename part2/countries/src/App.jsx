import { useState ,useEffect} from 'react'
import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
const weatherUrl = 'https://api.openweathermap.org/data/3.0/onecall?'

const SearchBar = ({input, setInput}) => {
  return(
    <div>
        find countries <input
          value={input}
          onChange={e => setInput(e.target.value)}
        />
      </div>
  )
}

const ShowWeather = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  const [lat, lon] = country.capitalInfo?.latlng || []

  useEffect(() => {
    if (!lat || !lon) return
    const key = import.meta.env.VITE_WEATHER_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`

    axios.get(url)
      .then(res => setWeather(res.data))
      .catch(err => setError(err))
  }, [lat, lon])

  if (error) return <p>Weather data not available</p>
  if (!weather) return <p>Loading weather...</p>
  console.log(weather)

  return (
    <div>
      <h3>Weather in {country.capital?.[0]}</h3>
      <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
      <p><strong>Wind:</strong> {weather.wind.speed} m/s</p>
      <p><strong>Condition:</strong> {weather.weather[0].description}</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
    </div>
  )
}


const ShowOneCountry = ({ country , goBack, input}) => {
  return (
    <div>
      <h3>{country.name.common}</h3>
      <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
      <p><strong>Area:</strong> {country.area} km²</p>
      <p><strong>Languages:</strong> {
        country.languages
          ? Object.values(country.languages).join(', ')
          : 'N/A'
      }</p>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="100" />
      <ShowWeather country ={country}></ShowWeather>
      <p></p>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};


const FilterCountries = ({ countries, input ,setInput}) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  const filteredArray = input.trim()
    ? countries.filter(country =>
        country.name.common.toLowerCase().includes(input.toLowerCase()))
    : countries;
    
  const total = filteredArray.length;

  if (selectedCountry) {
    return <ShowOneCountry country={selectedCountry} goBack={() => (setSelectedCountry(null), setInput(''))} />
  }

  if (total > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  if (total > 1 && total <= 10) {
    return (
      <ul>
        {filteredArray.map((country) => (
          <li key={country.name.common}>
            {country.name.common}{' '}
            <button onClick={() => setSelectedCountry(country)}>Show</button>
          </li>
        ))}
      </ul>
    );
  }

  if (total === 1) {
    return <ShowOneCountry country={filteredArray[0]} goBack={() => (setSelectedCountry(null), setInput(''))} />;
  }

  return null;
};

function App() {
  const [input,setInput] = useState('')
  const [countries, setCountries] = useState([])
  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setCountries(response.data)
    })
  }, []) 

  return(
  <div>
    <SearchBar input ={input} setInput={setInput}></SearchBar>
    <FilterCountries input={input} countries = {countries} setInput={setInput}></FilterCountries>
  </div>
)
}

export default App