const express = require('express') //importar el modulo de express
const app = express() // creamos la app

let persons =
     [
      {
        "name": "Arto Hellas",
        "number": "040-654321",
        "id": "1"
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
      },
      {
        "id": "a4db",
        "name": "asdasd",
        "number": "231313"
      }
    ]

app.get('/api/persons',(request, response) => {
    response.json(persons)
})

const PORT = 3001
app.listen(PORT)
