import CountryDetails from './countrydetails'

const CountrySelectionList = ({ countriesToShow, input, setInput }) => {
  return (
      <div>
        {countriesToShow.map((country, index) => (
          <li key={index}>{country}<button onClick={() => setInput(country)}>Show</button></li>
        ))}
      </div>
  )
}

const CountryList = ({countryData, input, setInput}) => {

  if (countryData.length === 0) {
    return <p>Loading data...</p>
  }

  const countrynames = countryData.map(country => country.name.common)
  const countriesToShow = countrynames.filter(country => country.toLowerCase().includes(input.toLowerCase()))
  
  if (countriesToShow.length > 10) {
    return <p>Too many search results, please refine your search</p>
  } 
  
  if (countriesToShow.length === 1) {
    const country = countryData.find(country => country.name.common === countriesToShow[0])
    return <CountryDetails country={country} />
  }

  return (
    <CountrySelectionList countriesToShow={countriesToShow} input={input} setInput={setInput} />
  )
}

export default CountryList