const personsRouter = require('express').Router()
const Person = require('../models/person')

const sameName = (name) => {
    Person.exists({name: name}).then(result => {
        return result
    })
}

personsRouter.get('/info', (request, response, next) => {
    Person.countDocuments({}).then(count => {
        const date = new Date()
        response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
    })
    .catch(error => next(error))
})

personsRouter.get('/', (request, response, next) => {
    Person.find({}).then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

personsRouter.get('/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if(person){
        response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

personsRouter.delete('/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    }).catch(error => next(error))
})

personsRouter.post('/', (request, response, next) => {
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
    .catch(error => next(error))

})

personsRouter.put('/:id', (request, response, next) => {
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

module.exports = personsRouter