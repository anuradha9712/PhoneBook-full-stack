const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const data = require('./db.json');
const path = require('path');

let person = data.persons

app.use(bodyParser.json())
app.use(cors());

// if (process.env.NODE_ENV === 'production') {
  // app.use(express.static(path.join(__dirname, 'build')));
  app.use(express.static(path.join(__dirname, '/client_side/build')));
// }

app.get('/api', (req, res) => {
  res.json(person)
  console.log("inside server side get method")
  console.log(person)
})

app.get('/info', (req, res) => {
  res.send(`
    <div>
        <p>Phonebook has info for ${person.length} people</p>
        <p>${Date()}</p>
    </div>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const data = person.find(x => x.id === id)
  if (data) {
    res.json(data)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/:id', (req, res) => {
  console.log("inside server side delete method")

  const id = Number(req.params.id)
  person = person.filter(x => x.id !== id)

  res.status(204).end()
})

const generateID = () => {
  const maxId = person.length > 0
    ? Math.max(...person.map(n => n.id))
    : 0
  return maxId + 1
}

app.put('/api/:id', (req, res) => {
  console.log("inside server side put method");
  const id = Number(req.params.id);
  // let updatePerson = person.filter(x=> x.id === id);
  person = person.map((x) => {
    if (x.id === id) {
      x.number = req.body.number;
      return x;
    }
    else {
      return x;
    }
  })
  // person[id-1].number = req.body.number;
  console.log("person list--> ", person);

  res.json(person);
})

app.post('/api', (req, res) => {
  console.log("inside server side post method")

  const body = req.body

  if (!body.name) {
    return res.status(400).json({
      error: 'Name missing'
    })
  }

  if (!body.number) {
    return res.status(400).json({
      error: 'Number missing'
    })
  }

  if (person.some(value => { return body.name === value.name })) {
    return res.status(400).json({
      error: 'Name must be unique'
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: body.id
  }
  person = person.concat(newPerson)

  console.log(newPerson)
  res.json(newPerson)
})

// app.get('*', (req, res) => {
//   console.log("inside all router--> ")
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client_side/build/index.html'));
});



//for catching requests made to non-existent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

const port = process.env.PORT || 9000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
