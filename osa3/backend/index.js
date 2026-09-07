const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

morgan.token('body', function (req, res) { 
    return JSON.stringify(req.body)
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

let persons = [
    {
      "name": "Mikko",
      "number": "123123321",
      "id": "1"
    },
    {
      "name": "Katja",
      "number": "74745574754",
      "id": "2"
    },
    {
      "name": "Pena",
      "number": "111233",
      "id": "3"
    },
    {
      "name": "Sam",
      "number": "12345",
      "id": "4"
    },
    {
      "name": "Niko",
      "number": "123456",
      "id": "5"
    }
  ]

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
})



app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})




const generateId = () => {
  const randomId = Math.floor(Math.random() * 10000000)
  return String(randomId)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'nimi puuttuu',
    })
  }

    if (!body.number) {
    return response.status(400).json({
      error: 'numero puuttuu',
    })
  }

    if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({
      error: 'nimi on jo olemassa',
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})