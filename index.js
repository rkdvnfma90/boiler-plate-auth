const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User } = require('./models/User')
const config = require('./config/key')

// 미들웨어 사용?
// application/x-www-form-urlencoded 를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({ extended: true }))
// application/json 타입으로 된 것을 분석해서 가져올 수 있게 함
app.use(bodyParser.json())

const mongoose = require('mongoose')
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB connected..'))
  .catch((err) => console.log(err))

app.get('/', (req, res) => res.send('hello world'))

app.post('/register', (req, res) => {
  // body-parser 가 클라이언트에서 요청한 값들을 받아 올 수 있다.
  // 회원 가입 할때 필요한 정보들을 클라이언트에서 받아와서 데이터 베이스에 저장한다.
  // req.body 에는 아래와 같은 json이 들어있다.
  // 이렇게 json 형의 데이터가 들어 있을 수 있는 것은 body-parser 가 있기 떄문.
  /*
     {
         id: "kpl",
         password: "1234"
     }
  */
  const user = new User(req.body)

  // user 모델에 저장된다.
  user.save((err, doc) => {
    // doc 에는 저장할 데이터가 들어있다. 이걸 document 라고 한다.
    // 에러가 발생하면 클라이언트로 에러 정보를 응답해 준다.
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true,
    })
  })
})

app.listen(port, () => console.log(`port is ${port}`))
