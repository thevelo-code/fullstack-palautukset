require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})


const requestLogger = (request, _response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)




app.get('/', (_request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (_request, response) => {
  const date = new Date()
  Person.find({}).then((persons) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
  })
})



app.get('/api/persons', (_request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
    //console.log('persons:', persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

//vanha delete, ei toimi
/*
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter((person) => person.id !== id)

  response.status(204).end()
})*/

//uusi
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  const randomId = Math.floor(Math.random() * 10000000)
  return String(randomId)
}

app.post('/api/persons', (request, response, next) => {
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

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  /*persons = persons.concat(person)
  response.json(person)*/
  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
    .catch(error => {
      console.log('error:', error.message)
      next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = body.name
      person.number = body.number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, _request, response, next) => {
  console.log('----------------')
  console.error(error)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})