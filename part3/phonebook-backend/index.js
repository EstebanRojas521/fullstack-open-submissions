require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()
app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons/create', async (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(409).send('Name and numbers are requiered.')
  }

  const existingPerson = await Person.findOne({ name })

  if(existingPerson){
    return response.status(409).send('No repeats dude.' )
  }
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(savedPerson => {
    console.log(`added ${savedPerson.name} ${savedPerson.number} to the phonebook!`)
    response.status(201).json(savedPerson)
  })
    .catch(error => {
      console.error(error.message)
      next(error)
    })
})

app.put('/api/persons/update/:id', async (request, response, next) => {
  const { name, number } = request.body
  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    )
    if (!updatedPerson) {
      return response.status(404).json({ message: 'Person not found.' })
    }
    response.json(updatedPerson)
  } catch (err) {
    next(err)
  }
})



app.get('/info', async(request, response) => {
  const count = await Person.countDocuments()
  response.send(`Phonebook has info for ${count} people <br> ${new Date()}`)
})

app.get('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    const existingPerson = await Person.findById(id)

    if (existingPerson) {
      response.json(existingPerson)
    } else {
      response.status(404).end()
    }
  } catch (err) {
    next(err)
  }
})

app.delete('/api/persons/delete/:id', async(request, response, next) => {
  const id = request.params.id
  try {
    let result = await Person.deleteOne({ _id: id })

    if (result.deletedCount === 0) {
      return response.status(404).json({ message: ' Post not found.'  })
    }

    return response.status(200).json({ message: 'Post deleted successfully.' })
  } catch (err) {
    next(err)
  }
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)// fallback for unhandled error types
}


app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})