import { useState , useEffect} from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import PersonList from './components/PersonList'
import Notification from './components/Notification'




const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({message : null, type: null})

  useEffect(() => {
    personService
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  console.log('render', persons.length, 'persons')

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const deletePerson = (id, name) => {
    personService
      .remove(id, name)
      .then(() => {
        showNotification(`Henkilö ${name} poistettu`, 'success')
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch(error => {
        showNotification(`Henkilö ${name} oli jo poistettu palvelimelta`, 'error')
        setPersons(persons.filter(person => person.id !== id))
      })
      
  } 

  const updatePerson = (current, newNumber) => {
    const updatedPerson = { ...current, number: newNumber }
    console.log(updatedPerson)
    personService
      .update(current.id, updatedPerson)
      .then(data => {
        showNotification(`Päivitettiin henkilön ${current.name} numero`, 'success')
        setPersons(persons.map(person => person.id !== current.id ? person : data))
      })
      .catch(error => {
        showNotification(`Henkilö ${newName} ei löytynyt palvelimelta, yritä lisäämistä uudelleen`, 'error')
        setPersons(persons.filter(person => person.id !== current.id))
      })
    setNewName('')
    setNewNumber('')
  }

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.some(person => person.name === newName)) {
      const existingPerson = persons.find(person => person.name === newName)
      if (window.confirm(`${newName} on jo olemassa, korvataanko vanha numero uudella?`)) {
        updatePerson(existingPerson, newNumber)
      }
      return
    }

    personService
      .create(personObject)
      .then(data => {
        setPersons(persons.concat(data))
        setNewName('')
        setNewNumber('')
        showNotification(`Lisättiin ${newName}`, 'success')
      })
      .catch(error => {
        // Tää ei toimi, koska backend ei tällä hetkellä palauta virheviestiä. Pitäisi jotenkin pystyä tarkastamaan, että onko nimi jo olemassa.
        showNotification(`Henkilö ${newName} oli jo palvelimella`, 'error')
        setNewName('')
        setNewNumber('')
      })
    
  }

  return (
    <div>
      <h2>Puhelinluettelo</h2>
        <Notification {...notification} />
        <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>lisää uusi</h2>
        <PersonForm
          addPerson={addPerson}
          newName={newName}
          handleNameChange={handleNameChange}
          newNumber={newNumber}
          handleNumberChange={handleNumberChange}
        />
      <h2>Numerot</h2>
        <PersonList personsToShow={personsToShow} handleDelete={deletePerson} />
    </div>
  )
}

export default App