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
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
