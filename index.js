const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')
const config = require('./config/key')

// 미들웨어 사용?
// application/x-www-form-urlencoded 를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({ extended: true }))
// application/json 타입으로 된 것을 분석해서 가져올 수 있게 함
app.use(bodyParser.json())

app.use(cookieParser())

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

app.post('/api/users/register', (req, res) => {
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

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 데이터 베이스에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      })
    }

    // 요청된 이메일이 있다면 비밀번호가 맞는지 확인해야 한다.
    // User 모델에 comparePassword 메서드 작성함
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        })
      }

      // 비밀번호도 맞다면 해당 유저를 위한 토큰을 생성해야 한다.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err)

        // 토큰을 저장한다. 어디에? 쿠키 or 로컬스토리지 or 세션
        // 지금은 쿠키를 사용하겠다.
        res.cookie('x_auth', user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        })
      })
    })
  })
})

// auth는 미들웨어이다.
app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 왔다면, 성공적으로 미들웨어를 통과한 것이다.
  res.status(200).json({
    _id: req.user._id, // auth 미들웨어에서 req 설정을 했기에 불러올 수 있는것
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  })
})

app.listen(port, () => console.log(`port is ${port}`))
