require('dotenv').config()
const express = require('express') //importar el modulo de express
const morgan = require('morgan')
const cors = require('cors')
const app = express() // creamos la app
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(express.static('dist'))
app.use(cors())

let persons = []

const sameName = (name) => {
    return persons.some(p => p.name === name)
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/info', (request, response) => {
    let lengthPersons = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${lengthPersons} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if(!person.number || !person.name){
        return response.status(400).json({
            error: 'Person name or number is missing'
        })
    }

    if(sameName(person.name)){
        return response.status(400).json({
            error: 'Person name is already in phonebook'
        })
    }

    const newPerson = new Person({
        name: person.name,
        number: person.number,
    })

    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
