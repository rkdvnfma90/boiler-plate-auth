const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose
  .connect(
    'mongodb+srv://kpl:qwer1234@boilerplate.op97v.mongodb.net/boilerplate?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log('MongoDB connected..'))
  .catch((err) => console.log(err))

app.get('/', (req, res) => res.send('hello world'))
app.listen(port, () => console.log(`port is ${port}`))
