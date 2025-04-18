const express = require('express') //importar el modulo de express
const app = express() // creamos la app

app.use(express.json())

let persons =
     [
      {
        "name": "Arto Hellas",
        "number": "040-654321",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
    ]

app.get('/api/persons', (request, response) => {
    response.json(persons)
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
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()

})

app.post('/api/persons', (request, response) => {
    const person = request.body

    if(!person || !person.name){
        return response.status(400).json({
            error: 'person content is missing'
        })
    }

    const ids = persons.map(person => person.id)
    const idMax = Math.max(...ids)

    const newPerson = {
        name: person.name,
        number: person.number,
        id: idMax + 1
    }

    persons = persons.concat(newPerson)

    response.json(newPerson)

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
