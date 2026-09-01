import {useState , useEffect} from 'react'
import countryservice from './services/countryservice'
import CountryList from './components/countrylist'


const App = () => {
  const [countryData, setCountryData] = useState([])
  const [input, setInput] = useState('')
  
  useEffect(() => {
    countryservice
      .getAll()
      .then(data => {
        setCountryData(data)
      })
  }, [])
  
  const handleInputChange = (event) => {
    setInput(event.target.value)
  }

  const handleClearInput = () => {
    setInput('')
  }

  return (
    <div>
      Find country: <input value={input} onChange={handleInputChange} />
      <button onClick={handleClearInput}>Clear</button>
      <CountryList countryData={countryData} input={input} setInput={setInput} />
    </div>
  )
}

export default App